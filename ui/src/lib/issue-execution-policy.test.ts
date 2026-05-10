import { describe, expect, it } from "vitest";
import { stageParticipantValues } from "./issue-execution-policy";

// Some legacy/inbox-created issues carried advisory-only executionPolicy metadata
// before Paperclip introduced the structured { mode, stages } execution policy.
// IssueProperties must tolerate those records so the issue detail page can render.
describe("stageParticipantValues", () => {
  it("treats legacy advisory execution policy objects without stages as empty", () => {
    const legacyPolicy = {
      clean_scope_only: true,
      requires_human_approval_for_scope_change: true,
    };

    expect(stageParticipantValues(legacyPolicy as never, "review")).toEqual([]);
    expect(stageParticipantValues(legacyPolicy as never, "approval")).toEqual([]);
  });

  it("builds participant selections from structured execution policies", () => {
    expect(stageParticipantValues({
      mode: "normal",
      commentRequired: true,
      stages: [{
        id: "stage-1",
        type: "review",
        approvalsNeeded: 1,
        participants: [{ id: "participant-1", type: "agent", agentId: "agent-1", userId: null }],
      }],
    }, "review")).toEqual(["agent:agent-1"]);
  });
});
