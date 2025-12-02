// === Helpers para adaptar tipos conforme o banco ===

export function resolveIdType(db: string): string {
  switch (db) {
    case 'postgres':
      return 'uuid';
    case 'mssql':
      return 'uniqueidentifier';
    case 'sqlite':
      return 'text';
    default:
      return 'char';
  }
}

export function resolveGenerationStrategy(db: string): 'uuid' | undefined {
  return db === 'postgres' ? 'uuid' : undefined;
}

export function resolveIdDefault(db: string): string | undefined {
  switch (db) {
    case 'postgres':
      return 'gen_random_uuid()';
    case 'mysql':
    case 'mariadb':
      return '(UUID())';
    case 'mssql':
      return 'NEWID()';
    case 'sqlite':
      return '(lower(hex(randomblob(16))))';
    default:
      return undefined;
  }
}

export function resolveDateType(db: string): string {
  return db === 'mssql' ? 'datetime' : 'timestamp';
}

export function resolveDateDefault(db: string): string {
  switch (db) {
    case 'postgres':
      return 'now()';
    case 'mysql':
    case 'mariadb':
      return 'CURRENT_TIMESTAMP';
    case 'sqlite':
      return "(datetime('now'))";
    case 'mssql':
      return 'GETDATE()';
    default:
      return 'CURRENT_TIMESTAMP';
  }
}
