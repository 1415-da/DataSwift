#!/usr/bin/env python3

from src.models.db import db

# Test if experiments exist
exps = list(db.experiments.find({'user_id': 'demo'}))
print(f'Found {len(exps)} experiments')

for exp in exps:
    print(f"Experiment: {exp.get('name', 'Unknown')} - Status: {exp.get('status', 'Unknown')} - ID: {exp.get('_id', 'Unknown')}")

print("\nAll experiments:")
for exp in exps:
    print(f"- {exp}") 