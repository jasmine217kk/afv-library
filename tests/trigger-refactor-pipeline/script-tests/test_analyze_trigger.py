import sys
import os

sys.path.insert(0, os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "skills",
    "trigger-refactor-pipeline", "scripts",
))

from analyze_trigger import TriggerAnalyzer

CLEAN_TRIGGER = """\
trigger AccountTrigger on Account (before insert) {
    for (Account a : Trigger.new) {
        if (a.Name == null) {
            a.Name = 'Default';
        }
    }
}"""

DML_IN_LOOP_TRIGGER = """\
trigger OpportunityTrigger on Opportunity (after update) {
    for (Opportunity o : Trigger.new) {
        Task t = new Task(WhatId = o.Id, Subject = 'Follow up');
        insert t;
    }
}"""


class TestTriggerAnalyzer:
    def test_initializes_with_name(self):
        analyzer = TriggerAnalyzer("MyTrigger")
        assert analyzer.trigger_name == "MyTrigger"

    def test_clean_trigger_has_no_dml_issues(self):
        analyzer = TriggerAnalyzer("AccountTrigger")
        analyzer.trigger_body = CLEAN_TRIGGER
        analyzer.analyze_dml_in_loops()
        assert len(analyzer.issues["dml_in_loops"]) == 0

    def test_detects_dml_in_loop(self):
        analyzer = TriggerAnalyzer("OpportunityTrigger")
        analyzer.trigger_body = DML_IN_LOOP_TRIGGER
        analyzer.analyze_dml_in_loops()
        assert len(analyzer.issues["dml_in_loops"]) == 1

    # TODO: Add more tests - SOQL in loops, bulkification, complexity scoring, etc.
