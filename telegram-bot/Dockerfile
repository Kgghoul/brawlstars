# Python Telegram Bot and API
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose API port
EXPOSE 8000

# Run the API server (or bot)
# You can override this command to run bot.py instead
CMD ["python", "api.py"]
