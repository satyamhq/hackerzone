-- supabase/seed.sql: AI economy skill taxonomy, demo challenges, campuses, companies, and resources

-- 1. AI Economy Skill Taxonomy
INSERT INTO public.skills (id, name, slug, category, description, icon) VALUES
  ('00000000-0000-0000-0000-000000000001', 'LLM Prompt Engineering', 'llm-prompt-engineering', 'AI Engineering', 'Techniques for few-shot learning, chain-of-thought reasoning, and structured JSON extraction from LLMs.', 'Cpu'),
  ('00000000-0000-0000-0000-000000000002', 'RAG Architectures', 'rag-architectures', 'AI Engineering', 'Retrieval-augmented generation pipelines using vector embeddings, hybrid search, chunking, and reranking.', 'Layers'),
  ('00000000-0000-0000-0000-000000000003', 'PyTorch Deep Learning', 'pytorch-deep-learning', 'Machine Learning', 'Building, training, and optimizing neural network architectures and loss functions using PyTorch.', 'Code'),
  ('00000000-0000-0000-0000-000000000004', 'AI Agent Systems', 'ai-agent-systems', 'AI Engineering', 'Autonomous multi-agent workflows, tool execution, memory management, and ReAct decision loops.', 'Bot'),
  ('00000000-0000-0000-0000-000000000005', 'Model Fine-Tuning & LoRA', 'model-fine-tuning', 'Machine Learning', 'Parameter-efficient fine-tuning (PEFT/LoRA/QLoRA), dataset curation, and instruction tuning.', 'Sliders'),
  ('00000000-0000-0000-0000-000000000006', 'Vector Databases & Embeddings', 'vector-databases', 'Data & Infrastructure', 'Indexing high-dimensional embeddings with pgvector, Pinecone, and Qdrant for semantic search.', 'Database'),
  ('00000000-0000-0000-0000-000000000007', 'Computer Vision & Diffusion', 'computer-vision-diffusion', 'Machine Learning', 'Object detection, image segmentation, and latent diffusion generation pipelines.', 'Eye'),
  ('00000000-0000-0000-0000-000000000008', 'LangChain & LlamaIndex', 'langchain-llamaindex', 'Frameworks', 'Building production agentic chains, loaders, and indexing abstractions.', 'GitBranch')
ON CONFLICT (id) DO NOTHING;

-- 2. Challenges
INSERT INTO public.challenges (id, skill_id, title, slug, description, difficulty, challenge_type, starter_code, test_cases, points, time_limit_sec, is_published) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Structured JSON Extraction with System Prompts',
    'structured-json-extraction',
    'Design a robust system prompt and schema validator function that extracts structured invoice entities (vendor, invoice_number, items, total_amount, currency) from noisy raw OCR transcripts without hallucinating fields.',
    'medium',
    'code',
    '{"python": "def extract_invoice_data(ocr_transcript: str) -> dict:\n    # Implement your parsing and prompt logic\n    pass"}',
    '[{"input": "INVOICE #9823 ACME CORP Total: $450.00", "expected": {"invoice_number": "9823", "vendor": "ACME CORP", "total_amount": 450.0}}]',
    100,
    1800,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Hybrid Vector & Keyword Reranker Pipeline',
    'hybrid-vector-reranker',
    'Implement a reciprocal rank fusion (RRF) algorithm combining dense vector similarity scores with BM25 sparse keyword matches, followed by a cross-encoder score filter.',
    'hard',
    'code',
    '{"python": "def rrf_hybrid_search(dense_results: list, sparse_results: list, k: int = 60) -> list:\n    # Calculate RRF scores\n    pass"}',
    '[{"input": "query: AI agent scaling", "expected": "top_ranked_doc_id"}]',
    200,
    2400,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    'Multi-Step Tool-Calling Agent Loop',
    'multi-step-tool-agent',
    'Construct a ReAct evaluation harness where an autonomous agent determines whether to execute a calculator tool, a web search tool, or emit a final response within a maximum of 5 iterations.',
    'hard',
    'code',
    '{"python": "class ReActAgent:\n    def __init__(self, tools: list):\n        self.tools = tools\n    def run(self, prompt: str) -> str:\n        pass"}',
    '[]',
    250,
    3600,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Campuses
INSERT INTO public.campuses (id, name, slug, domain, tier, city, state, is_verified, stats) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Indian Institute of Technology Delhi', 'iit-delhi', 'iitd.ac.in', 'tier_1', 'New Delhi', 'Delhi', true, '{"student_count": 450, "placement_rate": 96.5, "average_package": 2200000}'),
  ('20000000-0000-0000-0000-000000000002', 'Indian Institute of Technology Bombay', 'iit-bombay', 'iitb.ac.in', 'tier_1', 'Mumbai', 'Maharashtra', true, '{"student_count": 520, "placement_rate": 98.1, "average_package": 2450000}'),
  ('20000000-0000-0000-0000-000000000003', 'Birla Institute of Technology and Science, Pilani', 'bits-pilani', 'pilani.bits-pilani.ac.in', 'tier_1', 'Pilani', 'Rajasthan', true, '{"student_count": 380, "placement_rate": 94.2, "average_package": 1950000}'),
  ('20000000-0000-0000-0000-000000000004', 'International Institute of Information Technology Hyderabad', 'iiit-hyderabad', 'iiit.ac.in', 'tier_1', 'Hyderabad', 'Telangana', true, '{"student_count": 310, "placement_rate": 97.4, "average_package": 2300000}')
ON CONFLICT (id) DO NOTHING;

-- 4. Companies
INSERT INTO public.companies (id, name, slug, industry, company_size, headquarters, is_verified, tier, message_allowance) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Sarvam AI', 'sarvam-ai', 'Generative AI & LLMs', '50-100', 'Bengaluru', true, 'pro', 200),
  ('30000000-0000-0000-0000-000000000002', 'Krutrim AI', 'krutrim-ai', 'AI Infrastructure', '100-250', 'Bengaluru', true, 'pro', 200),
  ('30000000-0000-0000-0000-000000000003', 'Haptik AI', 'haptik-ai', 'Conversational AI', '250-500', 'Mumbai', true, 'basic', 10),
  ('30000000-0000-0000-0000-000000000004', 'Postman Labs', 'postman', 'Developer Tooling & API Platform', '500-1000', 'Bengaluru', true, 'enterprise', 1000)
ON CONFLICT (id) DO NOTHING;

-- 5. Learning Resources
INSERT INTO public.resources (title, slug, category, description, content, difficulty, estimated_read_time_min, tags) VALUES
  (
    'Production RAG Optimization: From Chunking to Reranking',
    'production-rag-optimization',
    'AI Engineering',
    'A tactical engineering guide on building low-latency, high-accuracy retrieval pipelines in production.',
    '# Production RAG Optimization\n\nRetrieval-Augmented Generation (RAG) is the backbone of knowledge-grounded AI applications...',
    'advanced',
    12,
    ARRAY['RAG', 'Vector Search', 'Embeddings', 'Python']
  ),
  (
    'Demystifying AI Agent Architecture: ReAct, Planning, & Memory',
    'demystifying-ai-agent-architecture',
    'AI Engineering',
    'How modern autonomous agents maintain long-term memory, decompose goals into subtasks, and recover from tool errors.',
    '# AI Agent Architecture\n\nAutonomous agents differ from simple prompt-completion chains by possessing state, memory, and reflection mechanisms...',
    'intermediate',
    8,
    ARRAY['AI Agents', 'Tool Calling', 'LangChain', 'System Design']
  ),
  (
    'Getting Started with LoRA Fine-Tuning on Custom Datasets',
    'lora-fine-tuning-guide',
    'Machine Learning',
    'Step-by-step walkthrough to fine-tune open-weights models (Llama 3, Mistral) on Indian language instruction datasets.',
    '# LoRA Fine-Tuning Guide\n\nLow-Rank Adaptation (LoRA) reduces trainable parameters by up to 99% while preserving model capability...',
    'intermediate',
    10,
    ARRAY['LoRA', 'PEFT', 'PyTorch', 'HuggingFace']
  );
