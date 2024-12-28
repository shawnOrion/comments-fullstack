# Quick Reference for Backend Setup

## Initialization Commands
1. **Initialize a new Node.js project**:
   ```bash
   npm init -y
   ```

2. **Install dependencies**:
   - Express:
     ```bash
     npm install express
     ```
   - CORS:
     ```bash
     npm install cors
     ```
   - Heroku CLI (optional):
     ```bash
     npm install -g heroku
     ```

---

## GitHub Repo Commands
1. **Initialize a Git repository**:
   ```bash
   git init
   ```

2. **Add files to the repository**:
   ```bash
   git add .
   ```

3. **Commit changes**:
   ```bash
   git commit -m "Initial commit"
   ```

4. **Link to GitHub repository**:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   ```

5. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## Heroku Repo Commands
1. **Log in to Heroku**:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create <app-name>
   ```

3. **Add a buildpack (Node.js)**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Deploy the app**:
   ```bash
   git push heroku main
   ```

5. **Check logs**:
   ```bash
   heroku logs --tail
   ```

6. **Open the app**:
   ```bash
   heroku open
   ```

---

## File Templates
- `index.js`: Template for an Express app with CORS protection.
- `Procfile`: Template for Heroku deployment.
