
# Nirvana- Project README

## Objective
Nirvana- is a comprehensive platform for audio, video, and text analysis, focusing on confidence scoring, deception detection, resume analysis, and more. It integrates backend processing, frontend user interfaces, and supporting scripts to deliver a robust solution for automated interview and behavioral analysis.

## Folder Structure
```
Nirvana-/
├── package.json            # Project metadata and dependencies
├── README.md               # Main project documentation
├── backend/                # Backend server and analysis modules
│   ├── app.py
│   ├── Akshat/
│   ├── functions_testing/
│   ├── media/
│   ├── pratham(backend)/
├── frontend/               # Frontend applications
│   ├── Disha-app/
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── vite.config.js
│   │   ├── public/
│   │   └── src/
├── mvp/                    # MVP prototype
│   ├── README.md
│   ├── setup.bat
│   ├── setup.sh
│   ├── backend/
│   └── frontend/
├── Notebooks/              # Jupyter notebooks for analysis and prototyping
│   ├── confidence.ipynb
│   ├── Image_confidence.ipynb
│   └── VLM_approach-Qwen.ipynb
```

## Functionality
- **Backend**: Provides APIs and modules for audio, video, and text analysis, including confidence and deception scoring.
- **Frontend**: User interfaces for interacting with backend services, visualizing results, and managing workflows.
- **MVP**: Contains scripts and setup files for the minimum viable product.
- **Notebooks**: Prototyping and data analysis using Jupyter notebooks.
- **Media**: Sample files for testing and demonstration.

## Usage
1. **Install Dependencies**
   - For backend:
     ```powershell
     cd backend/pratham(backend)
     pip install -r requirements.txt
     ```
   - For frontend:
     ```powershell
     cd frontend/Disha-app
     npm install
     ```
2. **Run Backend Server**
   ```powershell
   cd backend
   python app.py
   ```
3. **Run Frontend**
   ```powershell
   cd frontend/Disha-app
   npm run dev
   ```
4. **Use Notebooks**
   - Open notebooks in the `Notebooks/` folder with Jupyter Lab or VS Code.

## Notes
- Ensure media files are placed in the correct subfolders for testing.
- Each major folder (backend, frontend, mvp) may have its own README and setup instructions.
- API endpoints and usage details are documented in the respective backend and frontend READMEs.

## Objective Recap
- Automate interview analysis and behavioral scoring.
- Provide modular, extensible architecture for research and development.
- Support rapid prototyping and testing via notebooks and sample media.

## Contact
For questions, issues, or contributions, contact the repository owner or refer to the individual module READMEs for more details.
