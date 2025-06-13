FROM python:3.9-slim

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./task_manager /task_manager
WORKDIR /task_manager
EXPOSE ${API_PORT}

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev gcc python3-dev musl-dev libffi-dev && \
    /py/bin/pip install --no-cache-dir -r /tmp/requirements.txt && \
    apt-get purge -y --auto-remove gcc python3-dev musl-dev libffi-dev && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp

ENV PATH="/py/bin:$PATH"

CMD ["sh", "-c", "python manage.py wait_for_db && python manage.py migrate && python manage.py runserver 0.0.0.0:${API_PORT:-8000}"]