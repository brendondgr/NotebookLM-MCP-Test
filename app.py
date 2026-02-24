import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

# Mount static directories
app.mount("/web", StaticFiles(directory="web"), name="web")
app.mount("/data", StaticFiles(directory="data"), name="data")
app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/")
async def root():
    return RedirectResponse(url="/web/index.html")

if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=7450, reload=True)
