async def up(cx):
    return await cx.execute("""
    
    CREATE TABLE passive_migrations(
        migration INT
    )

    """)
