# Backend Setup Instructions

## Quick Setup

If you see errors about `pip` or `venv` not being found, follow these steps:

### Step 1: Install Python Dependencies

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv
```

### Step 2: Run the Backend

After installing pip and venv, you can use either method:

**Option A: Use the script**
```bash
cd /home/sarabpreetsingh/Documents/proj
./start-backend.sh
```

**Option B: Manual commands**
```bash
cd /home/sarabpreetsingh/Documents/proj/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Verification

After setup, you should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

The backend will be accessible at: **http://localhost:8000**

## Troubleshooting

- **"pip not found"**: Run `sudo apt install python3-pip`
- **"venv not found"**: Run `sudo apt install python3-venv`
- **Port 8000 in use**: Change port with `uvicorn main:app --reload --port 8001`
