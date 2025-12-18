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
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY REPORT');
    console.log('='.repeat(60));
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;

    // Sort suites for better readability
    const sortedSuites = Object.keys(this.suiteStats).sort();

    sortedSuites.forEach((suiteName) => {
      const stats = this.suiteStats[suiteName];
      totalPassed += stats.passed;
      totalFailed += stats.failed;
      totalTests += stats.total;

      const status = stats.failed === 0 ? '✅' : '❌';
      const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
      
      console.log(
        `${status} ${suiteName.padEnd(30)} ${stats.passed.toString().padStart(3)}/${stats.total} passed (${percentage}%)`
      );
    });

    console.log('='.repeat(60));
    console.log(
      `📈 TOTAL: ${totalPassed} passed, ${totalFailed} failed, ${totalTests} total`
    );
    console.log('='.repeat(60) + '\n');
  }
}

module.exports = TestSummaryReporter;

