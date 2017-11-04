import asyncio
from db.migrations import mig001
import db.cxpool

migrations = [
    # Add migrations here in order.
    mig001,
]

async def run_migrations():
    await db.cxpool.manually_setup_cxpool()
   
    async with db.cxpool.cxpool.acquire() as connection:
        for migration in migrations:
            print("#" * 20, migration.__name__, "#"*20)
            tx = connection.transaction()
            await tx.start()
            try:
                print(await migration.up(connection))
                await tx.commit()
            except Exception as e:
                print("#" * 40)
                print("\nError while trying to run migration:", e)
                await tx.rollback()
                raise
                
            print("#" * 40)

    await db.cxpool.manually_teardown_cxpool()


def main():
    print("Checking current migrations status.")
        
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_migrations())
    loop.close()

if __name__ == '__main__':
    main()
