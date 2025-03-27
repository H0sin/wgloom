import atexit
import os
import subprocess
from pathlib import Path

from fastapi.staticfiles import StaticFiles

from app import app
from config import DEBUG, VITE_BASE_API, DASHBOARD_PATH

base_dir = Path(__file__).parent
build_dir = base_dir / 'build'
statics_dir = build_dir / 'assets'


def set_environment():
  with open('/src/app/environments/environments.ts', 'r', encoding='utf-8') as file:
    content = file.read()
    modified_content = content.replace('http://localhost:3000/api', VITE_BASE_API)
    file.write(modified_content)

def build():
  proc = subprocess.Popen(
    ['ng', 'build', '--prod', '--output-path', str(build_dir)],
    env={**os.environ, 'VITE_BASE_API': VITE_BASE_API},
    cwd=base_dir
  )
  set_environment()
  proc.wait()


def run_dev():
  proc = subprocess.Popen(
    ['npm', 'start', '--host=0.0.0.0', '--disable-host-check', f'--base-href={os.path.join(DASHBOARD_PATH, '')}'],
    env={**os.environ, 'VITE_BASE_API': VITE_BASE_API},
    cwd=base_dir
  )

  atexit.register(proc.terminate)


def run_build():
  if not build_dir.is_dir():
    build()

  app.mount(
    DASHBOARD_PATH,
    StaticFiles(directory=build_dir, html=True),
    name="dashboard"
  )

  app.mount(
    '/statics/',
    StaticFiles(directory=statics_dir, html=True),
    name="statics"
  )


@app.on_event("startup")
def startup():
  if DEBUG:
    run_dev()
  else:
    run_build()
