"""Simplified draw simulation for the fair-access proposal (v2).

Fictional model, not a measurement. It checks two claims:
1. With one entry per applicant, broker-assisted applicants win their fair share
   (seats x broker share), so speed gives no advantage.
2. Without duplicate checks (each broker client enters 5 times), the broker side
   wins far more entries.

Run:  python3 research/allocation_sim.py [runs]
Standard library only, so it runs anywhere.
"""
import random
import statistics
import sys

SEED = 20261015
APPLICANTS = 1000      # unique single-seat applicants
BROKER = 200           # of whom broker-assisted
SEATS = 200


def draw(entries, seats, rng):
    """Shuffle all entries (equal chance each) and take the first `seats`."""
    rng.shuffle(entries)
    return entries[:seats]


def run(runs, broker_entries_each):
    rng = random.Random(SEED)
    wins = []
    for _ in range(runs):
        entries = ['B'] * (BROKER * broker_entries_each) + ['D'] * (APPLICANTS - BROKER)
        picked = draw(entries, SEATS, rng)
        wins.append(picked.count('B'))
    wins.sort()
    lo, hi = wins[int(0.025 * runs)], wins[int(0.975 * runs) - 1]
    return statistics.mean(wins), lo, hi


if __name__ == '__main__':
    runs = int(sys.argv[1]) if len(sys.argv) > 1 else 20000
    m, lo, hi = run(runs, 1)
    print(f'One entry each     : broker side wins {m:.2f} of {SEATS} seats on average '
          f'(expected {SEATS * BROKER / APPLICANTS:.0f}); middle 95% of draws {lo}-{hi}')
    m5, lo5, hi5 = run(runs, 5)
    print(f'5 entries per client: broker side wins {m5:.2f} of {SEATS} entries on average; '
          f'middle 95% of draws {lo5}-{hi5}')
    print(f'({runs} runs, seed {SEED}. Ranges show draw-to-draw variation, not a real-world rate.)')
