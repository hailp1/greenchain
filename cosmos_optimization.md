# Cosmos SDK Server Optimization (app.toml)

To handle 1,000,000+ transactions per day while keeping the server light, configure the following settings in your `app.toml` and `config.toml`.

## 1. Pruning (Storage Optimization)
Pruning removes old states, keeping only the necessary data for state sync and recent validation.

```toml
# File: ~/.greenchain/config/app.toml

[state-sync]
# Enable state sync to allow new nodes to join quickly without downloading the whole history
snapshot-interval = 1000
snapshot-keep-recent = 2

[pruning]
# 'everything' keeps no state, 'nothing' keeps everything.
# 'custom' allows fine-tuning.
strategy = "custom"
interval = 10
keep-recent = 100
keep-every = 0
```

## 2. API Caching
Enable the internal gRPC and REST caches if needed, but we recommend using a Redis layer for QR code lookups.

```toml
# File: ~/.greenchain/config/app.toml

[api]
enable = true
swagger = true
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"
```

## 3. Consensus (config.toml)
Since we are using **Proof of Authority (PoA)**, we can speed up block times.

```toml
# File: ~/.greenchain/config/config.toml

[consensus]
timeout_commit = "1s" # Faster blocks for PoA
```

## 4. Indexing (Optional)
If you rely on Supabase for queries, you can disable the node's internal indexer to save CPU and Disk.

```toml
# File: ~/.greenchain/config/config.toml

[tx_index]
indexer = "null" # Disable internal indexing, rely on Supabase
```
