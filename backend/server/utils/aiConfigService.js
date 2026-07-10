const configService = require('./configService');

/**
 * Professional service for managing AI models, prompts, and configurations.
 */
class AIConfigService {
    /**
     * Get LLM settings (model, temperature, etc)
     */
    async getSettings() {
        let fromDb = await configService.getConfig('llm_settings', null);
        if (typeof fromDb === 'string') {
            try {
                fromDb = JSON.parse(fromDb);
            } catch {
                fromDb = null;
            }
        }
        if (fromDb) return fromDb;

        if (process.env.NODE_ENV === 'production') {
            console.error('[AIConfigService] llm_settings missing in platform_config (production).');
            return null;
        }

        return {
            model: 'llama-3.1-8b-instant',
            temperature: 0.2,
            max_tokens: 1024,
        };
    }

    /**
     * Get a specific prompt template by key.
     */
    async getPrompt(key, fallback) {
        const prompts = await configService.getConfig('prompt_templates', {});
        return prompts[key] || fallback;
    }

    /**
     * Unified interface to call AI models (Groq/Grok/OpenRouter)
     */
    async callAI({ prompt, systemPrompt = "You are a helpful career mentor. You output only valid JSON.", temperature = null }) {
        const settings = await this.getSettings();
        if (!settings?.model) {
            console.error("[AIConfigService] LLM settings unavailable.");
            return null;
        }

        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) {
            console.error("[AIConfigService] No API key found.");
            return null;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);

        try {
            const groqApiBase = process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1/chat/completions';
            const resp = await fetch(groqApiBase, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: settings.model,
                    temperature: temperature ?? settings.temperature,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt },
                    ],
                }),
                signal: controller.signal,
            });

            if (!resp.ok) {
                const err = await resp.text();
                throw new Error(`AI API error: ${resp.status} - ${err}`);
            }

            const data = await resp.json();
            const content = data?.choices?.[0]?.message?.content;
            return content ? JSON.parse(content) : null;
        } catch (error) {
            console.error("[AIConfigService] AI call failed:", error.message);
            return null;
        } finally {
            clearTimeout(timer);
        }
    }
}

module.exports = new AIConfigService();
