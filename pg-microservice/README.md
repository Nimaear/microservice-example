# Creating needed table

```sql
CREATE TABLE tasks ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), data json );
```