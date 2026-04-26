# Use ubuntu as base image
FROM ubuntu:22.04 AS base

# Avoid prompts from apt during the build process
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Update and install system-level dependencies (Python and Go)
# Clean up apt cache in the same layer to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    golang-go \
    && rm -rf /var/lib/apt/lists/*

# Install Python libraries using pip3
RUN pip3 install --no-cache-dir \
    openai \
    groq \
    pydantic \
    fastapi \
    uvicorn

# Copy backend code into the container
COPY ./ /app/src