@echo off
setlocal

:: Set project root directory (adjust if needed)
set NODE_NO_WARNINGS=1
set PROJECT_ROOT=%cd%

:: Change to project root directory
cd /d %PROJECT_ROOT%

:: Clear the console
cls

:: Display a message
echo ==========================================
echo  Running maintenance and upgrade tasks...
echo ==========================================

:: Install or update Node packages
echo Installing/updating Node packages...
call npm install --legacy-peer-deps

:: Run ESLint to check code quality
echo Running ESLint...
call npx eslint . --fix

:: Run Husky installation if it's not already done
if not exist ".husky" (
    echo Setting up Husky...
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
)

:: Run tests if applicable (uncomment if you have tests)
:: echo Running tests...
:: call npm test

:: Display a message
cls
echo ================================
echo        Starting project...
echo ================================

:: Display installed packages and their statuses using Node.js script
:: echo Checking package statuses...
:: node -e "const chalk = require('chalk'); const { table } = require('table'); const packages = [
::   { name: 'Express', status: 'Running', color: chalk.green },
::   { name: 'Nodemon', status: 'Running (Dev)', color: chalk.yellow },
::   { name: 'Browser-Sync', status: 'Configured', color: chalk.green },
::   { name: 'dotenv', status: 'Loaded', color: chalk.green },
::   { name: 'morgan', status: 'Running', color: chalk.green },
::   { name: 'compression', status: 'Running', color: chalk.green },
::   { name: 'helmet', status: 'Running', color: chalk.green },
::   { name: 'Chalk', status: 'Loaded', color: chalk.green },
::   { name: 'Table', status: 'Loaded', color: chalk.green }
:: ]; console.log(table([['Package', 'Status'], ...packages.map(pkg => [pkg.color(pkg.name), pkg.color(pkg.status)])]));"

:: Run the project with Nodemon and Browser-Sync
npm run dev

:: Pause the script to keep the window open
pause

endlocal
