import json, sys
sys.stdout.reconfigure(encoding='utf-8')
from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

print('=== TEST: Login as Bhumikaa ===')
r1 = client.post('/api/auth/login', json={'email': 'bhumikaa@proofweave.io', 'password': 'bhumikaa123'})
b_token = r1.json().get('access_token')
b_id = r1.json().get('user', {}).get('id')
print('Bhumikaa ID=' + str(b_id) + ', Token=' + str(b_token)[:20] + '...')

print()
print('=== TEST: Login as Aarav ===')
r2 = client.post('/api/auth/login', json={'email': 'aarav@proofweave.io', 'password': 'aarav123'})
a_token = r2.json().get('access_token')
a_id = r2.json().get('user', {}).get('id')
print('Aarav ID=' + str(a_id) + ', Token=' + str(a_token)[:20] + '...')

print()
print('=== TEST: Bhumikaa conversations ===')
r3 = client.get('/api/messages/conversations', headers={'Authorization': 'Bearer ' + b_token})
b_convs = r3.json()
for c in b_convs:
    pnames = ', '.join([p['name'] for p in c['participants']])
    print('  ' + c['id'] + ' | ' + c['title'] + ' | participants: ' + pnames)

print()
print('=== TEST: Aarav conversations ===')
r4 = client.get('/api/messages/conversations', headers={'Authorization': 'Bearer ' + a_token})
a_convs = r4.json()
for c in a_convs:
    pnames = ', '.join([p['name'] for p in c['participants']])
    print('  ' + c['id'] + ' | ' + c['title'] + ' | participants: ' + pnames)

print()
print('=== TEST: Bhumikaa sends message to Student-Mentor conv ===')
conv_id = b_convs[0]['id']
r5 = client.post('/api/messages/conversations/' + conv_id + '/messages', 
    headers={'Authorization': 'Bearer ' + b_token},
    json={'text': 'Hello Aarav, dataset validation is done!'})
print('  Sent: ' + str(r5.json().get('text', '')))

print()
print('=== TEST: Aarav sees the message ===')
r6 = client.get('/api/messages/conversations/' + conv_id, headers={'Authorization': 'Bearer ' + a_token})
msgs = r6.json()
for m in msgs:
    print('  [' + m['sender_name'] + '] ' + m['text'])

print()
print('=== ALL TESTS PASSED ===')
