INSERT INTO "PlatformPlan" (
    "key",
    "name",
    "description",
    "monthlyPriceCents",
    "previousPriceCents",
    "features",
    "stripePriceId",
    "active",
    "updatedAt"
)
VALUES
    (
        'BASIC',
        'Básico',
        'Para clínicas menores',
        2790,
        9790,
        ARRAY['Até 3 serviços', 'Agendamentos ilimitados', 'Suporte', 'Relatórios'],
        NULL,
        true,
        CURRENT_TIMESTAMP
    ),
    (
        'PROFESSIONAL',
        'Profissional',
        'Para clínicas em crescimento',
        9790,
        19790,
        ARRAY['Até 50 serviços', 'Agendamentos ilimitados', 'Suporte prioritário', 'Relatórios avançados'],
        NULL,
        true,
        CURRENT_TIMESTAMP
    ),
    (
        'PREMIUM',
        'Premium IA',
        'Tecnologia e recursos avançados',
        19790,
        39790,
        ARRAY['Até 999 serviços', 'Todos os recursos Profissional', 'Ferramentas de IA e análise avançada'],
        NULL,
        true,
        CURRENT_TIMESTAMP
    )
ON CONFLICT ("key") DO NOTHING;
