# Performance Baseline Metrics - 2025-07-01

## Bundle Size Analysis

### Main Website (Customer-Facing)
- **Total Size:** 270.89 kB (raw) / 77.05 kB (gzipped)
- **React Vendor:** 140.88 kB / 45.26 kB (gzipped) 
- **i18n Vendor:** 71.67 kB / 19.71 kB (gzipped)
- **Main App Code:** 70.22 kB / 22.77 kB (gzipped)
- **CSS:** 30.96 kB / 5.75 kB (gzipped)
- **Lazy Loaded Chunks:**
  - Services: 9.88 kB / 4.20 kB
  - About: 4.30 kB / 2.07 kB
  - Location: 4.16 kB / 1.32 kB

### Admin Dashboard
- **Total Size:** 247.94 kB (raw) / 78.91 kB (gzipped)
- **React Vendor:** 140.87 kB / 45.24 kB (gzipped)
- **Main App Code:** 105.99 kB / 32.20 kB (gzipped)
- **CSS:** 14.96 kB / 3.47 kB (gzipped)

## Performance Opportunities Identified

### High Impact Optimizations
1. **React Vendor Bundle:** 45.26 kB gzipped (largest single asset)
2. **i18n Bundle:** 19.71 kB gzipped (could be lazy-loaded by language)
3. **Main App Bundle:** 22.77 kB gzipped (opportunities for tree-shaking)
4. **CSS Size:** 5.75 kB gzipped (could be reduced with critical CSS)

### Bundle Composition Analysis
- **Vendor Code:** 65.01 kB gzipped (84% of total)
- **Application Code:** 12.04 kB gzipped (16% of total)
- **Lazy Loading:** ✅ Implemented for route components
- **Tree Shaking:** ✅ Enabled but optimization opportunities exist

## Performance Targets

### Current vs Target
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Initial Bundle | 77.05 kB | 65 kB | -12.05 kB |
| React Vendor | 45.26 kB | 40 kB | -5.26 kB |
| Main App | 22.77 kB | 18 kB | -4.77 kB |
| CSS | 5.75 kB | 4 kB | -1.75 kB |

### Performance Budget
- **Critical Path:** < 50 kB gzipped
- **Total Initial Load:** < 65 kB gzipped
- **Lazy Chunks:** < 10 kB each
- **Critical CSS:** < 3 kB inline