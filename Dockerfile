ARG PYTHON_VERSION=3.12

FROM python:$PYTHON_VERSION-slim AS build

ENV PYTHONUNBUFFERED=1

WORKDIR /wgloom

RUN apt-get update \
    && apt-get install -y --no-install-recommends iproute2 wireguard wireguard-tools iptables

COPY ./requirements.txt /wgloom/

RUN python3 -m pip install --upgrade pip setuptools \
    && pip install --no-cache-dir --upgrade -r /wgloom/requirements.txt

COPY . /wgloom
EXPOSE 8000

RUN apt-get update && \
apt-get install -y iproute2 wireguard wireguard-tools iptables

CMD ["bash", "-c", "alembic upgrade head; python main.py"]