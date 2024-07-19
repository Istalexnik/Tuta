# deploy.ps1

# Change to the directory containing the git repository
cd D:/Aka/TutaProd

# Ensure the directory change is successful before running commands
if ($?) {
    # Pull the latest changes from the main branch
    git pull origin main

    # Reload the PM2 processes with the new code
    pm2 reload D:/Aka/ecosystem.config.js --env production

    # Save the PM2 process list
    pm2 save
} else {
    Write-Host "Failed to change directory to D:/Aka/TutaProd"
}
