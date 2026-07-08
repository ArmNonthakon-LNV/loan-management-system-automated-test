const fs = require('fs-extra')
const path = require('path')
const XLSX = require('xlsx-js-style')

function safeReadWorkbook(filePath) {
  try {
    return XLSX.readFile(filePath)
  } catch (_e) {
    return XLSX.utils.book_new()
  }
}

function recordTestEvident(options = {}) {
  const {
    reportDir,
    filePrefix = 'evident-',
    idleSeconds = 10,
    getKey = (payload) =>
      payload && /^api[A-Za-z]+$/.test(payload.apiName || '') ? payload.apiName : 'default',
    headers,
    buildRow,
  } = options

  if (!reportDir) {
    throw new Error('excelValidationReporter: reportDir is required')
  }

  const NEW_RUN_IDLE_SEC = idleSeconds

  const HEADERS =
    headers && headers.length
      ? headers
      : [
          'Test Case ID',
          'Status',
          'Test Case',
          'Error Code',
          'Error Message',
          'HTTP Code',
          'Test Date',
          'Tested By',
          'Request Body',
        ]

  const currentVersionByKey = {}
  const currentSheetByKey = {}

  function getReportPath(key) {
    const safe = key && typeof key === 'string' ? key : 'default'
    return path.join(reportDir, `${filePrefix}${safe}.xlsx`)
  }

  function getMarkerPath(key) {
    const safe = key && typeof key === 'string' ? key : 'default'
    return path.join(reportDir, `.validation-report-last-write-${safe}`)
  }

  function defaultBuildRow(payload) {
    const {
      testCaseId = '',
      status = '',
      testTitle = '',
      errorCode = '',
      errorMessage = '',
      httpCode = '',
      testDate = '',
      testedBy = '',
      requestBody,
    } = payload || {}

    const cleanTitle = (testTitle || '').replace(/^\[TC-V-\d{4}\]\s*/, '')

    return [
      testCaseId,
      status,
      cleanTitle,
      errorCode ?? '',
      errorMessage ?? '',
      httpCode ?? '',
      testDate,
      testedBy,
      typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody || ''),
    ]
  }

  function append(payload) {
    if (!payload || typeof payload.testTitle !== 'string') return

    const key = getKey(payload) || 'default'
    const reportPath = getReportPath(key)
    const markerPath = getMarkerPath(key)

    let currentSheetName =
      currentSheetByKey[key] != null ? currentSheetByKey[key] : null
    let currentVersion =
      currentVersionByKey[key] != null ? currentVersionByKey[key] : null

    fs.ensureDirSync(reportDir)

    let wb

    if (currentSheetName && fs.existsSync(markerPath)) {
      try {
        const stat = fs.statSync(markerPath)
        const mtimeMs = stat.mtimeMs != null ? stat.mtimeMs : stat.mtime.getTime()
        if (Date.now() - mtimeMs > NEW_RUN_IDLE_SEC * 1000) {
          currentSheetName = null
          currentVersion = null
        }
      } catch (_e) {
        currentSheetName = null
        currentVersion = null
      }
    }

    if (!currentSheetName) {
      if (fs.existsSync(reportPath)) {
        wb = safeReadWorkbook(reportPath)
        const versionPattern = /^version (\d+)$/i
        let maxVersion = 0
        const sheetNames = Array.isArray(wb.SheetNames) ? wb.SheetNames : []
        sheetNames.forEach((name) => {
          const match = String(name).match(versionPattern)
          if (match) {
            const versionNum = parseInt(match[1], 10)
            if (versionNum > maxVersion) {
              maxVersion = versionNum
            }
          }
        })
        currentVersion = maxVersion + 1
      } else {
        wb = XLSX.utils.book_new()
        currentVersion = 1
      }
      currentSheetName = `version ${currentVersion}`
      currentSheetByKey[key] = currentSheetName
      currentVersionByKey[key] = currentVersion
    } else {
      if (fs.existsSync(reportPath)) {
        wb = safeReadWorkbook(reportPath)
      } else {
        wb = XLSX.utils.book_new()
      }
    }

    if (!Array.isArray(wb.SheetNames)) wb.SheetNames = []
    if (!wb.SheetNames.includes(currentSheetName)) {
      wb.SheetNames.push(currentSheetName)
      wb.Sheets[currentSheetName] = XLSX.utils.aoa_to_sheet([HEADERS])
    }

    const ws = wb.Sheets[currentSheetName]
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    const nextRow = range.e.r + 2

    const rowData = (buildRow || defaultBuildRow)(payload) || []

    const normalizedStatus = String(payload.status || '').toUpperCase().trim()
    let fillColor = null
    let fontColor = 'FF000000'

    if (normalizedStatus === 'PASSED') {
      fillColor = 'FF00B050'
      fontColor = 'FFFFFFFF'
    } else if (normalizedStatus === 'FAILED') {
      fillColor = 'FFFF0000'
      fontColor = 'FFFFFFFF'
    } else if (
      normalizedStatus === 'NORUN' ||
      normalizedStatus === 'NO-RUN' ||
      normalizedStatus === 'NO RUN'
    ) {
      fillColor = 'FFD9D9D9'
      fontColor = 'FF000000'
    }

    rowData.forEach((value, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({
        r: nextRow - 1,
        c: colIndex,
      })
      ws[cellRef] = { t: 's', v: String(value ?? '') }

      if (colIndex === 1 && fillColor) {
        ws[cellRef].s = {
          fill: {
            fgColor: { rgb: fillColor },
            patternType: 'solid',
          },
          font: {
            color: { rgb: fontColor },
            bold: true,
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        }
      }
    })

    ws['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: nextRow - 1, c: HEADERS.length - 1 },
    })

    const currentRange = XLSX.utils.decode_range(ws['!ref'])
    for (let row = 1; row <= currentRange.e.r; row++) {
      const statusCellRef = XLSX.utils.encode_cell({ r: row, c: 1 })
      if (ws[statusCellRef] && ws[statusCellRef].v) {
        const cellStatus = String(ws[statusCellRef].v).toUpperCase().trim()
        let cellFillColor = null
        let cellFontColor = 'FF000000'

        if (cellStatus === 'PASSED') {
          cellFillColor = 'FF00B050'
          cellFontColor = 'FFFFFFFF'
        } else if (cellStatus === 'FAILED') {
          cellFillColor = 'FFFF0000'
          cellFontColor = 'FFFFFFFF'
        } else if (
          cellStatus === 'NORUN' ||
          cellStatus === 'NO-RUN' ||
          cellStatus === 'NO RUN'
        ) {
          cellFillColor = 'FFD9D9D9'
          cellFontColor = 'FF000000'
        }

        if (cellFillColor) {
          ws[statusCellRef].s = {
            fill: {
              fgColor: { rgb: cellFillColor },
              patternType: 'solid',
            },
            font: {
              color: { rgb: cellFontColor },
              bold: true,
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          }
        }
      }
    }

    XLSX.writeFile(wb, reportPath)
    try {
      fs.writeFileSync(markerPath, currentSheetName, 'utf8')
    } catch (_e) {
      // ignore
    }
  }

  function reset() {
    Object.keys(currentVersionByKey).forEach((k) => delete currentVersionByKey[k])
    Object.keys(currentSheetByKey).forEach((k) => delete currentSheetByKey[k])
  }

  return { append, reset }
}

module.exports = {
  recordTestEvident,
}
