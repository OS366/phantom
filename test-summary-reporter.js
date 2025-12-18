class TestSummaryReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.suiteStats = {};
  }

  onTestResult(test, testResult) {
    testResult.testResults.forEach((result) => {
      const suiteName = this.getSuiteName(result.ancestorTitles);
      if (!this.suiteStats[suiteName]) {
        this.suiteStats[suiteName] = { passed: 0, failed: 0, total: 0 };
      }
      this.suiteStats[suiteName].total++;
      if (result.status === 'passed') {
        this.suiteStats[suiteName].passed++;
      } else if (result.status === 'failed') {
        this.suiteStats[suiteName].failed++;
      }
    });
  }

  getSuiteName(ancestors) {
    // Get the top-level suite name (first ancestor)
    return ancestors.length > 0 ? ancestors[0] : 'Other';
  }

  onRunComplete(contexts, results) {
    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;

    const sortedSuites = Object.keys(this.suiteStats).sort();
    
    sortedSuites.forEach((suiteName) => {
      const stats = this.suiteStats[suiteName];
      totalPassed += stats.passed;
      totalFailed += stats.failed;
      totalTests += stats.total;
    });

    console.log('\n┌─ Test Summary ────────────────────────────────┐');
    
    sortedSuites.forEach((suiteName) => {
      const stats = this.suiteStats[suiteName];
      const status = stats.failed === 0 ? '✓' : '✗';
      const name = suiteName.replace('phantom.', '');
      const pct = ((stats.passed / stats.total) * 100).toFixed(0);
      console.log(`│ ${status} ${name.padEnd(22)} ${String(stats.passed).padStart(2)}/${stats.total} (${pct}%) │`);
    });

    const status = totalFailed === 0 ? '✓' : '✗';
    console.log(`├───────────────────────────────────────────────┤`);
    console.log(`│ ${status} Total: ${totalPassed}/${totalTests}${totalFailed > 0 ? ` (${totalFailed} failed)` : ''}${' '.repeat(25)}│`);
    console.log('└───────────────────────────────────────────────┘\n');
  }
}

module.exports = TestSummaryReporter;

