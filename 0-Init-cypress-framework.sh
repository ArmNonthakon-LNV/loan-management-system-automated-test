#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   ./init-cypress-framework.sh [TARGET_DIRECTORY]
# If TARGET_DIRECTORY is not provided, the current directory is used.
# -----------------------
# CHECK NODEJS
# -----------------------

echo "🔍 Checking Node.js..."

if ! command -v node &> /dev/null
then
    echo "⚠️ Node.js not found. Installing Node.js..."

    OS="$(uname)"

    if [ "$OS" = "Darwin" ]; then
        echo "🍎 Detected macOS"

        if ! command -v brew &> /dev/null
        then
            echo "Installing Homebrew..."

            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi

        brew install node

    elif [ "$OS" = "Linux" ]; then

        echo "🐧 Detected Linux"

        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs

    else
        echo "❌ Unsupported OS. Please install Node.js manually."
        exit 1
    fi

else
    echo "✅ Node.js already installed"
    node -v
fi

echo "🚀 Initializing Cypress QA Framework (Production)"

# -----------------------
# INIT PROJECT
# -----------------------

TARGET_DIR="${1:-$(pwd)}"
CYPRESS_DIR="$TARGET_DIR/cypress"

echo "Using target directory: $TARGET_DIR"

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

npm init -y

# -----------------------
# INSTALL DEPENDENCIES
# -----------------------

echo "📦 Installing dependencies..."

npm install --save-dev cypress
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
npm install --save-dev xmysql
npm install --save-dev dotenv
npm install t2p-clientlib


npm install mysql fs-extra xlsx-js-style --save

echo "Initializing Cypress framework structure in: $CYPRESS_DIR"

# Create directory structure
mkdir -p "$CYPRESS_DIR/config"
mkdir -p "$CYPRESS_DIR/e2e"
mkdir -p "$CYPRESS_DIR/fixtures"
mkdir -p "$CYPRESS_DIR/reports"
mkdir -p "$CYPRESS_DIR/results"
mkdir -p "$CYPRESS_DIR/support/common"
mkdir -p "$CYPRESS_DIR/support/db/checkDb"
mkdir -p "$CYPRESS_DIR/support/db/checkDb/deepPocket"
mkdir -p "$CYPRESS_DIR/support/db/checkDb/iBaht"
mkdir -p "$CYPRESS_DIR/support/db/getDb"
mkdir -p "$CYPRESS_DIR/support/db/getDb/deepPocket"
mkdir -p "$CYPRESS_DIR/support/db/getDb/iBaht"
mkdir -p "$CYPRESS_DIR/support/db/setDb"
mkdir -p "$CYPRESS_DIR/support/db/setDb/deepPocket"
mkdir -p "$CYPRESS_DIR/support/db/setDb/iBaht"
mkdir -p "$CYPRESS_DIR/support/preSteps"
mkdir -p "$CYPRESS_DIR/tools"
mkdir -p "$CYPRESS_DIR/zDocs"

# Create empty files matching the template project
touch "$CYPRESS_DIR/cypress.config.js"
touch "$CYPRESS_DIR/config/test.json"
touch "$CYPRESS_DIR/config/dev.json"
touch "$CYPRESS_DIR/e2e/spec.cy.js"
touch "$CYPRESS_DIR/support/commands.js"
touch "$CYPRESS_DIR/tools/genValidateFieldsCases.js"
touch "$CYPRESS_DIR/tools/recordTestEvident.js"
touch "$CYPRESS_DIR/support/common/apiHelper.js"
touch "$CYPRESS_DIR/support/db/checkDb/iBaht/tbCard.js"
touch "$CYPRESS_DIR/support/db/getDb/iBaht/tbCard.js"
touch "$CYPRESS_DIR/support/db/setDb/iBaht/tbCard.js"
touch "$CYPRESS_DIR/.gitignore"

echo "Cypress framework folder structure initialized successfully."

