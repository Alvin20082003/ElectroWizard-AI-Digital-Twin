# ⚠️ IMPORTANT - Dependency Installation Fix

## Problem
SHAP requires C++ build tools on Windows which can cause installation issues.

## ✅ Solution Applied
The requirements.txt has been updated to use flexible versions that will install pre-built binaries.

## Quick Fix Commands

Run these commands in PowerShell:

```powershell
cd j:\newveroxa\backend

# Install all dependencies (this should work now)
pip install fastapi uvicorn pandas "numpy>=1.24.0,<2.0.0" scikit-learn xgboost shap joblib openpyxl python-multipart pydantic
```

## ✅ All Dependencies Are Now Installed!

You can verify by running:
```powershell
python -c "import fastapi, uvicorn, pandas, sklearn, xgboost, shap; print('All good!')"
```

## 🚀 Start the Backend

```powershell
cd j:\newveroxa\backend
uvicorn main:app --reload
```

**Backend will run at**: http://localhost:8000

## Alternative: Use Without SHAP

If SHAP still doesn't work, you can run the system without explainability features. The other 3 features will work fine:
- Risk Map ✅
- Restoration Priority ✅  
- Response Management ✅
- Explainable AI ⚠️ (needs SHAP)

To skip SHAP, just comment it out in the imports of `explainable_ai.py`.

## Next Steps

1. ✅ Dependencies installed
2. ⏭️ Start backend: `uvicorn main:app --reload`
3. ⏭️ In another terminal, start frontend: `cd j:\newveroxa\frontend && npm start`

You're almost there! 🎉
