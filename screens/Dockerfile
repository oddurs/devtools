# The screens studio: builds each project from source, photographs and records it.
# Terminal shots: fish under ttyd, its xterm.js page in headless Chromium,
# driven by Playwright; starship prompt, JetBrains Mono.
# Web shots: Playwright driving the same Chromium, SwiftShader for WebGL.
# Real services for fixtures to run (quarry identifies them): Redis, nginx.
FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl git jq procps iproute2 lsof locales \
      build-essential pkg-config cmake libssl-dev \
      python3 python3-venv \
      fish ffmpeg chromium webp \
      redis-server nginx-light \
      fonts-jetbrains-mono fonts-noto-color-emoji \
      nodejs npm \
    && rm -rf /var/lib/apt/lists/* \
    && sed -i 's/^# *en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen && locale-gen

ENV LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 TERM=xterm-256color COLORTERM=truecolor

# ttyd isn't packaged in trixie; its release ships static binaries.
ARG TTYD_VERSION=1.7.7
RUN arch="$(uname -m)" \
    && curl -fsSL -o /usr/local/bin/ttyd "https://github.com/tsl0922/ttyd/releases/download/${TTYD_VERSION}/ttyd.${arch}" \
    && chmod +x /usr/local/bin/ttyd && ttyd --version

RUN curl -fsSL https://starship.rs/install.sh | sh -s -- -y -b /usr/local/bin

ENV CARGO_HOME=/opt/cargo RUSTUP_HOME=/opt/rustup PATH=/opt/cargo/bin:/root/.local/bin:$PATH
RUN curl -fsSL https://sh.rustup.rs | sh -s -- -y --profile minimal --default-toolchain stable \
    && curl -LsSf https://astral.sh/uv/install.sh | sh

COPY runner/package.json /opt/runner/package.json
RUN cd /opt/runner && npm install --omit=dev --no-audit --no-fund

ENV CHROME_PATH=/usr/bin/chromium
RUN chsh -s /usr/bin/fish root

# ── A developer's machine, for inventories (yoghurt) ───────────────────────
#
# Last, so changing it rebuilds nothing above. Everything here is a real
# install by the ordinary route, as the user `dev`: Homebrew in the one place
# it lives on Linux, rustup and cargo in ~/.cargo, npm globals in
# ~/.npm-global, and a binary downloaded by hand into ~/.local/bin, which no
# package manager knows about.
RUN apt-get update && apt-get install -y --no-install-recommends file \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -s /usr/bin/fish dev \
    && mkdir -p /home/linuxbrew/.linuxbrew && chown -R dev: /home/linuxbrew

USER dev
ENV HOMEBREW_NO_ANALYTICS=1 HOMEBREW_NO_AUTO_UPDATE=1 HOMEBREW_NO_ENV_HINTS=1 \
    HOMEBREW_NO_INSTALL_CLEANUP=1
WORKDIR /home/dev

# Homebrew, from its repository, at its Linux prefix.
RUN git clone --depth 1 https://github.com/Homebrew/brew /home/linuxbrew/.linuxbrew/Homebrew \
    && mkdir -p /home/linuxbrew/.linuxbrew/bin \
    && ln -s ../Homebrew/bin/brew /home/linuxbrew/.linuxbrew/bin/brew \
    && /home/linuxbrew/.linuxbrew/bin/brew update --force --quiet

# What someone asked for.
RUN /home/linuxbrew/.linuxbrew/bin/brew install \
      ripgrep fd bat eza gh lazygit tmux htop tree jq hyperfine git-delta fzf zoxide wget starship

# Installed and then uninstalled, which leaves its dependencies behind:
# the residue yoghurt exists to find. (Homebrew now clears these up on
# uninstall unless told not to, as plenty of machines are, and older
# Homebrews never did.)
RUN /home/linuxbrew/.linuxbrew/bin/brew install neovim \
    && HOMEBREW_NO_AUTOREMOVE=1 /home/linuxbrew/.linuxbrew/bin/brew uninstall neovim

# Rust the ordinary way: rustup in ~/.rustup, two toolchains, and crates
# installed with cargo.
# (Scoped to these commands: the image-wide CARGO_HOME and RUSTUP_HOME are
# root's, for building the tools, and must stay so.)
RUN export CARGO_HOME=/home/dev/.cargo RUSTUP_HOME=/home/dev/.rustup \
      PATH=/home/dev/.cargo/bin:/usr/bin:/bin \
    && curl -fsSL https://sh.rustup.rs | sh -s -- -y --profile minimal --default-toolchain stable --no-modify-path \
    && rustup toolchain install 1.85 --profile minimal \
    && cargo install --locked tokei just \
    && rm -rf /home/dev/.cargo/registry /home/dev/.cargo/git

# npm globals, in the prefix npm's own docs suggest.
RUN npm config set prefix /home/dev/.npm-global \
    && npm install -g --no-audit --no-fund typescript prettier pnpm

# One thing downloaded and dropped on the PATH by hand.
RUN mkdir -p /home/dev/.local/bin \
    && curl -fsSL -o /home/dev/.local/bin/yq \
       "https://github.com/mikefarah/yq/releases/download/v4.45.4/yq_linux_$(dpkg --print-architecture)" \
    && chmod +x /home/dev/.local/bin/yq

USER root

# Last of all, so it costs one small layer rather than every layer above it:
# ImageMagick, for fixtures that need a real image (gummyworm converts its
# `rose:`, the photograph it has shipped for thirty years).
RUN apt-get update && apt-get install -y --no-install-recommends imagemagick \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /work/site

ENTRYPOINT ["node", "/work/site/screens/runner/run.mjs"]
