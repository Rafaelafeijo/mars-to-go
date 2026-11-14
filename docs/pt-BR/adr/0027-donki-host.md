# ADR-0027 — DONKI pelo host do CCMC, sem chave

Status: aceita, 2026-11-14. Refina a ADR-0004.

**Contexto.** Chamadas reais em 2026-11-14: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/*` respondeu com CORS `*` e sem chave; `kauai.ccmc.gsfc.nasa.gov` estourou o tempo limite; `api.nasa.gov/DONKI/FLR` devolveu 404, enquanto outras rotas devolveram 200.

**Decisão.** A API (camada ao vivo), o job do retrato e os scripts de dados chamam `ccmc.gsfc.nasa.gov/DONKI/WS/get`. A chave da API da NASA fica guardada só para outras APIs da NASA, no `.env`, nunca no repositório nem no navegador.

**Consequências.** Um único host para monitorar; o fallback em três camadas (ADR-0004) cobre as quedas dele.
