FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./task_manager /task_manager
WORKDIR /task_manager
EXPOSE ${API_PORT}

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    rm -rf /tmp

ENV PATH="/py/bin:$PATH"

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:${API_PORT:-8000}"]