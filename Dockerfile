FROM docker.io/library/node:22-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv python3-dev \
    git curl wget zip unzip jq \
    build-essential gcc g++ clang llvm lld cmake ninja-build make pkg-config \
    openjdk-17-jdk-headless \
    libffi-dev libssl-dev \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /workspace && chmod 0777 /workspace
WORKDIR /workspace
EXPOSE 8080
CMD ["sh", "-lc", "sleep infinity"]
