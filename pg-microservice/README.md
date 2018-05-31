# Creating needed table

```sql
CREATE TABLE emails ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), data json );
```
