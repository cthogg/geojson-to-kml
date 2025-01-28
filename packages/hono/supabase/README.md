To develop

```
supabase start # start the supabase stack
supabase functions serve # start the Functions watcher
curl  --location  'http://127.0.0.1:54321/functions/v1/hello-world/hello'
```

To deploy

```bash
supabase functions deploy

curl --request GET 'https://yvrmwbxbhglycwnckely.supabase.co/functions/v1/hello-world/hello' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cm13YnhiaGdseWN3bmNrZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjU0ODksImV4cCI6MjA1MTMwMTQ4OX0.YXu8R2oQIB4tXsIcrqkv1S8W2lTEr9B8kVRVKptugbU'
```
