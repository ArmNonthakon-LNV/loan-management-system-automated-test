---
inclusion: manual
---

# Skill: Read Excel/Table Data and Create Expected Test Case

## When to Use

When the user provides installment schedule data (from Excel, table, or pasted text) and wants to create or update the `expect_result` array in a test case fixture JSON file.

## Input Format

The user will provide data in table format with these columns (Thai or English headers):
- งวดที่ / Period (may have sub-periods like 1.1, 1.2)
- จำนวนวัน / Days
- ยอดผ่อนชำระ/งวด / contract_emi
- ดอกเบี้ย / bf_interest (full precision)
- ดอกเบี้ยที่จ่ายจริง / display_interst (2 decimal places)
- เงินต้นที่จ่ายจริง / bf_principal (full precision)
- เงินต้นที่ Recal / display_principal (2 decimal places)
- เงินต้นคงเหลือ / cf_pricipal_balance (full precision)
- display_principal_balance (2 decimal places)

## Special Case: Sub-periods (e.g., 1.1, 1.2)

When a period is split into sub-periods (like 1.1 and 1.2):
- **bf_interest**: SUM of all sub-periods (e.g., 1.1 interest + 1.2 interest)
- **bf_principal**: SUM of all sub-periods (e.g., 1.1 principal + 1.2 principal)
- **contract_emi**: SUM of all sub-periods EMI values
- **day**: SUM of all sub-periods days
- **cf_pricipal_balance**: Use the LAST sub-period value (e.g., use 1.2's balance)
- **display_interst**: Round the combined bf_interest to 2 decimals
- **display_principal**: Round the combined bf_principal to 2 decimals
- **display_principal_balance**: Round the last sub-period's cf_pricipal_balance to 2 decimals

## Output Format

Generate JSON array for `expect_result` field in the fixture file:

```json
"expect_result": [
    {
        "Period": 1,
        "day": 31,
        "contract_emi": 7509.7100000,
        "bf_interest": 1250.1839192,
        "display_interst": 1250.18,
        "bf_principal": 6259.5260808,
        "display_principal": 6259.53,
        "cf_pricipal_balance": 75230.4739192,
        "display_principal_balance": 75230.47
    },
    ...
]
```

## Rules

1. Keep full precision for `bf_interest`, `bf_principal`, `cf_pricipal_balance` (7 decimal places)
2. Round to 2 decimal places for `display_interst`, `display_principal`, `display_principal_balance`
3. Last period may have different `contract_emi` (final payment adjustment)
4. Last period `cf_pricipal_balance` may be negative (rounding residual) — use the exact value
5. Numbers in parentheses like `(0.0048042)` mean negative: `-0.0048042`
6. A dash `-` or empty in เงินต้นคงเหลือ means 0 (or near-zero with residual from the calculation)
7. Remove comma separators from numbers: `19,013.1135630` → `19013.1135630`
8. The field name is `display_interst` (not `display_interest`) — keep the typo for consistency with existing code
9. When sub-periods exist (1.1, 1.2, etc.), combine them into a single Period entry as described above

## Target File Location

`cypress/fixtures/lnv/scfRepayment/reqBody/bizLogic/{testCaseName}.json`

Replace only the `expect_result` array inside the `SCF` object. Do not modify other fields.

## Example Usage

User says: "Read this excel and create expected test case for testCase3"
→ Parse the table data, generate the `expect_result` array, and write/update the fixture file.

User says: "Read this excel and create expected test case for testCase7 but period 1 has 1.1 and 1.2"
→ Combine sub-periods: sum interest/principal/emi/days, use last sub-period's balance.
