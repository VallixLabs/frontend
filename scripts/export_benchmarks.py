"""Build src/site/data/benchmarks.json, the numbers behind the Research page and the landing-page chart,
from the valli repository's benchmark export (valli/benchmarks: leaderboards, curves, records).

    uv run --no-project --with pandas --with pyarrow python scripts/export_benchmarks.py ../valli

Nothing is computed here that the export does not already contain, except the 95% intervals: a
bootstrap over tables (dataset x scenario) of each model's per-table mean error, seeded, so reruns
give the same file. Places and means are the leaderboards' own.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pandas as pd

VALLI = Path(sys.argv[1] if len(sys.argv) > 1 else "../valli").resolve()
BENCH = VALLI / "benchmarks"
OUT = Path(__file__).resolve().parent.parent / "src" / "site" / "data" / "benchmarks.json"

# The three evaluations of the current pipeline (Kumo-small fine-tuned on PriorFM's pick = Valli).
EVALS = [
    ("syn", "Synthetic", "c_kumo_small_synthetic"),
    ("tab", "TabArena", "d_kumo_small_tabarena"),
    ("sci", "Scientific", "e_kumo_small_scientific"),
]
OURS = "Kumo-small fine-tuned on PriorFM's pick"
ERR = {"classification": "logloss", "regression": "crps_n"}       # rank metric, lower is better
ACC = {"classification": "accuracy", "regression": "r2"}
CAL = {"classification": "ece", "regression": "cov90"}

NAMES = {
    OURS: "valli",
    "kumo_tabular_small": "Kumo-small",
    "Kumo-small fine-tuned on our generic library": "Kumo-small, generic library (ablation)",
    "catboost": "CatBoost", "catboost_tuned": "CatBoost, tuned", "causilo": "Causilo", "domain": "Domain model",
    "ebm": "EBM", "exaone_tabular": "EXAONE Tabular", "extra_trees": "Extra trees", "gp": "GP", "iec_bins": "IEC bins",
    "iltm": "iLTM", "knn": "kNN", "kumo_tabular": "Kumo-large", "kumo_tabular_medium": "Kumo-medium",
    "lightgbm": "LightGBM", "lightgbm_tuned": "LightGBM, tuned", "limix_16m": "LimiX-16M", "limix_2": "LimiX-2",
    "limix_2m": "LimiX-2M", "linear": "Linear", "mitra_v1": "Mitra v1", "mitra_v2": "Mitra v2", "ngboost": "NGBoost",
    "orion_bix": "Orion-BiX", "orion_msp": "Orion-MSP", "orion_msp_v1_5": "Orion-MSP v1.5", "perpetual": "Perpetual",
    "random_forest": "Random forest", "realmlp": "RealMLP", "realtabpfn_v2_5": "RealTabPFN-2.5", "tabdpt": "TabDPT",
    "tabfm_v1_0": "TabFM v1.0", "tabfm_v1_1": "TabFM v1.1", "tabicl_v1_1": "TabICL v1.1", "tabicl_v2": "TabICLv2",
    "tabldm": "TabLDM", "tabm": "TabM", "tabpfn_v2": "TabPFN v2", "tabpfn_v2_5": "TabPFN-2.5", "tabpfn_v2_6": "TabPFN v2.6",
    "tabpfn_v3": "TabPFN v3", "tabpfn_v3_5": "TabPFN v3.5", "tabstar": "TabSTAR", "tabswift": "TabSwift",
    "trivial": "Trivial (ignores features)", "xgboost": "XGBoost", "xgboost_tuned": "XGBoost, tuned", "xrfm": "xRFM",
}


def num(x, nd=4):
    return None if x is None or (isinstance(x, float) and np.isnan(x)) else round(float(x), nd)


def bootstrap_ci(values, rng, n=2000):
    v = np.asarray(values, dtype=float)
    v = v[~np.isnan(v)]
    if len(v) < 2:
        return None, None
    means = rng.choice(v, size=(n, len(v)), replace=True).mean(axis=1)
    return float(np.percentile(means, 2.5)), float(np.percentile(means, 97.5))


def main():
    rng = np.random.default_rng(20261023)
    models_csv = pd.read_csv(BENCH / "models.csv").set_index("model_id")
    commit = subprocess.run(["git", "-C", str(VALLI), "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()

    out = {"source": {"repo": "VallixLabs/valli", "commit": commit, "path": "benchmarks/",
                      "note": "Exported 23 October 2026 from the research repository; see docs/BENCHMARKS.md."},
           "benches": [], "models": {}, "cells": {}, "rel": {}, "pva": {}, "datasets": {}}

    for k, label, key in EVALS:
        lb = pd.read_csv(BENCH / "leaderboards" / f"{key}.csv")
        rec = pd.read_parquet(BENCH / "records" / f"{key}.parquet")
        ms = sorted(set(lb[lb.task == "classification"].m) & set(lb[lb.task == "regression"].m))
        tables = {t: int(rec[rec.task == t].groupby(["dataset", "scenario"]).ngroups) for t in ERR}
        datasets = {t: sorted(rec[rec.task == t].dataset.unique()) for t in ERR}
        out["benches"].append({"k": k, "l": label, "evaluation": key, "ms": [int(m) for m in ms],
                               "tables": tables, "datasets": datasets})

        for (task, m), cell in lb.groupby(["task", "m"]):
            if m not in ms:
                continue
            em = ERR[task]
            r = rec[(rec.task == task) & (rec.m == m)]
            # per-table mean error (over repetitions), the unit of the bootstrap
            per_table = r.groupby(["model", "dataset", "scenario"])[em].mean()
            rows = []
            for _, row in cell.iterrows():
                mid = row.model
                lo, hi = bootstrap_ci(per_table.loc[mid].values, rng) if mid in per_table.index.get_level_values(0) else (None, None)
                rows.append({"id": mid, "place": None if pd.isna(row.place) else int(row.place), "mr": num(row.mean_rank, 3),
                             "err": num(row[em]), "lo": num(lo), "hi": num(hi), "acc": num(row[ACC[task]]), "cal": num(row[CAL[task]])})
                if mid not in out["models"]:
                    mc = models_csv.loc[mid] if mid in models_csv.index else None
                    out["models"][mid] = {"n": NAMES.get(mid, mid), "role": row.role,
                                          "family": None if mc is None or pd.isna(mc.family) else mc.family,
                                          "params": None if mc is None or pd.isna(mc.parameters) else int(mc.parameters)}
            first = cell.iloc[0]
            out["cells"][f"{k}|{task}|{int(m)}"] = {"n_ranked": int(first.n_ranked), "n_tables": int(first.n_tables), "rows": rows}

            # scientific: error per dataset (mean over scenarios and repetitions)
            if k == "sci":
                per_ds = r.groupby(["dataset", "model"])[em].mean()
                out["datasets"][f"{task}|{int(m)}"] = [
                    {"ds": ds, "err": {mid: num(v) for mid, v in per_ds.loc[ds].items()}}
                    for ds in datasets[task] if ds in per_ds.index.get_level_values(0)]

        rel = pd.read_csv(BENCH / "curves" / f"{key}_reliability.csv")
        for m, g in rel.groupby("m"):
            if m in ms:
                out["rel"][f"{k}|{int(m)}"] = {mid: [[num(a.confidence), num(a.accuracy), int(a.n)] for a in gg.sort_values("bin").itertuples()]
                                               for mid, gg in g.groupby("model")}
        pva = pd.read_csv(BENCH / "curves" / f"{key}_pred_vs_actual.csv")
        for m, g in pva.groupby("m"):
            if m in ms:
                out["pva"][f"{k}|{int(m)}"] = {mid: [[num(a.predicted), num(a.actual), int(a.n)] for a in gg.sort_values("bin").itertuples()]
                                               for mid, gg in g.groupby("model")}

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, separators=(",", ":")))
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KiB), valli {commit}")

    # The landing page's chart: TabArena classification, every ranked model at each number of rows.
    hb, ht = "tab", "classification"
    ms = next(b["ms"] for b in out["benches"] if b["k"] == hb)
    cells = [out["cells"][f"{hb}|{ht}|{m}"] for m in ms]
    ids = sorted({r["id"] for c in cells for r in c["rows"] if r["place"] is not None})
    hero = {"source": out["source"], "bench": "TabArena", "task": ht, "metric": "log loss", "ms": ms,
            "n_ranked": [c["n_ranked"] for c in cells], "n_tables": cells[0]["n_tables"],
            "models": {i: {"n": out["models"][i]["n"], "role": out["models"][i]["role"]} for i in ids},
            "rows": {i: [next(({"err": r["err"], "place": r["place"]} for r in c["rows"] if r["id"] == i and r["place"] is not None), None)
                         for c in cells] for i in ids}}
    HERO = OUT.parent / "hero.json"
    HERO.write_text(json.dumps(hero, separators=(",", ":")))
    print(f"wrote {HERO} ({HERO.stat().st_size / 1024:.1f} KiB)")


if __name__ == "__main__":
    main()
