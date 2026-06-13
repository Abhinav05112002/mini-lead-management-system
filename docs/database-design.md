Tables:

1. users
2. leads
3. activity_logs

Relationships:

users → leads
leads → activity_logs

+-----------+
| USERS     |
+-----------+
| id        |
| name      |
| email     |
| role      |
+-----------+
      |
      |
      V

+-----------+
| LEADS     |
+-----------+
| id        |
| name      |
| status    |
| assigned  |
+-----------+
      |
      |
      V

+----------------+
| ACTIVITY_LOGS  |
+----------------+
| action         |
| description    |
+----------------+
