# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Install production dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

ENV PYTHONPATH=/app


# Expose the port FastAPI runs on
EXPOSE 8000

# Run the FastAPI application
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000"]
