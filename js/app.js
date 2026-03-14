(function () {
  var storageKey = "whatupdog.profile";
  var chatKey = "whatupdog.chats";
  var page = document.body.getAttribute("data-page") || "";
  var data = window.WhatUpDogData || {};
  var demoProfiles = data.demoProfiles || [];
  var skillPool = data.skillPool || [];
  var starterProfile = data.starterProfile || {};

  function normalizeList(value) {
    return (value || "")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function getStoredProfile() {
    try {
      var saved = window.localStorage.getItem(storageKey);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      return null;
    }
  }

  function saveProfile(profile) {
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  }

  function getActiveProfile() {
    return getStoredProfile() || starterProfile;
  }

  function getChatStore() {
    try {
      return JSON.parse(window.localStorage.getItem(chatKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveChatStore(store) {
    window.localStorage.setItem(chatKey, JSON.stringify(store));
  }

  function titleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function intersection(a, b) {
    return a.filter(function (item) {
      return b.indexOf(item) !== -1;
    });
  }

  function uniqueCount(a, b) {
    var map = {};
    a.concat(b).forEach(function (item) {
      map[item] = true;
    });
    return Object.keys(map).length;
  }

  function availabilityScore(me, them) {
    var weights = {
      "nights": 0.55,
      "part-time": 0.78,
      "full-time": 1
    };
    return Math.round(((weights[me.availability] || 0.8) + (weights[them.availability] || 0.8)) / 2 * 100);
  }

  function timezoneScore(me, them) {
    if (me.timezone === them.timezone) return 100;
    var sameContinent = (me.timezone.indexOf("Time") !== -1 && them.timezone.indexOf("Time") !== -1);
    return sameContinent ? 78 : 62;
  }

  function roleComplementScore(me, them) {
    if (me.role !== them.role && me.role !== "hybrid" && them.role !== "hybrid") return 100;
    if (me.role === them.role && me.role !== "hybrid") return 52;
    return 82;
  }

  function stageScore(me, them) {
    var order = { idea: 1, mvp: 2, traction: 3, growth: 4 };
    var diff = Math.abs((order[me.stage] || 2) - (order[them.stage] || 2));
    if (diff === 0) return 100;
    if (diff === 1) return 84;
    if (diff === 2) return 65;
    return 48;
  }

  function skillComplementScore(me, them) {
    var shared = intersection(me.skills, them.skills).length;
    var total = uniqueCount(me.skills, them.skills) || 1;
    var overlapRatio = shared / total;
    var complementaryBonus = roleComplementScore(me, them) > 90 ? 18 : 8;
    return Math.max(45, Math.min(100, Math.round((1 - overlapRatio) * 62 + shared * 8 + complementaryBonus)));
  }

  function marketScore(me, them) {
    var shared = intersection(me.interests, them.interests);
    if (!shared.length) return 38;
    return Math.min(100, 58 + shared.length * 16);
  }

  function personalityScore(me, them) {
    var shared = intersection(me.personality, them.personality).length;
    return Math.min(100, 56 + shared * 11 + (shared ? 9 : 0));
  }

  function computeMatch(profile, candidate) {
    var scores = {
      role: roleComplementScore(profile, candidate),
      skills: skillComplementScore(profile, candidate),
      market: marketScore(profile, candidate),
      personality: personalityScore(profile, candidate),
      stage: stageScore(profile, candidate),
      availability: availabilityScore(profile, candidate),
      timezone: timezoneScore(profile, candidate)
    };

    var weighted = Math.round(
      scores.role * 0.2 +
      scores.skills * 0.18 +
      scores.market * 0.2 +
      scores.personality * 0.14 +
      scores.stage * 0.1 +
      scores.availability * 0.09 +
      scores.timezone * 0.09
    );

    var sharedMarkets = intersection(profile.interests, candidate.interests);
    var sharedTraits = intersection(profile.personality, candidate.personality);
    var summary = [];

    if (scores.role > 90) summary.push("clear role complement");
    if (sharedMarkets.length) summary.push("shared focus in " + sharedMarkets.slice(0, 2).join(" + "));
    if (scores.skills > 80) summary.push("strong skill coverage");
    if (sharedTraits.length) summary.push("aligned operating style");
    if (scores.availability > 85) summary.push("similar commitment level");

    return {
      candidate: candidate,
      score: weighted,
      sharedMarkets: sharedMarkets,
      sharedTraits: sharedTraits,
      breakdown: scores,
      summary: summary.slice(0, 4)
    };
  }

  function buildSkillGrid(form, existingSkills) {
    var grid = form.querySelector("[data-skill-grid]");
    if (!grid) return;
    grid.innerHTML = "";

    skillPool.forEach(function (skill) {
      var label = document.createElement("label");
      label.className = "chip-option";
      label.innerHTML = '<input type="checkbox" name="skills" value="' + skill + '"><span>' + skill + '</span>';
      var input = label.querySelector("input");
      if ((existingSkills || []).indexOf(skill) !== -1) {
        input.checked = true;
      }
      grid.appendChild(label);
    });
  }

  function populateForm(form, profile) {
    if (!form || !profile) return;
    ["name", "title", "location", "avatar", "timezone", "bio"].forEach(function (field) {
      if (form.elements[field] && profile[field]) form.elements[field].value = profile[field];
    });
    if (form.elements.interests) form.elements.interests.value = (profile.interests || []).join(", ");
    if (form.elements.personality) form.elements.personality.value = (profile.personality || []).join(", ");
    if (form.elements.stage && profile.stage) form.elements.stage.value = profile.stage;
    if (form.elements.availability && profile.availability) form.elements.availability.value = profile.availability;
    if (form.elements.role && profile.role) {
      var radio = form.querySelector('input[name="role"][value="' + profile.role + '"]');
      if (radio) radio.checked = true;
    }
  }

  function bindProfileForm() {
    var form = document.querySelector("[data-profile-form]");
    if (!form) return;

    var current = getActiveProfile();
    buildSkillGrid(form, current.skills || starterProfile.skills);
    populateForm(form, current);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var selectedSkills = Array.prototype.slice.call(form.querySelectorAll('input[name="skills"]:checked')).map(function (input) {
        return input.value;
      });
      var profile = {
        id: "you",
        name: form.elements.name.value.trim(),
        title: form.elements.title.value.trim(),
        location: form.elements.location.value.trim(),
        avatar: form.elements.avatar.value.trim() || "🐾",
        timezone: form.elements.timezone.value.trim(),
        role: form.querySelector('input[name="role"]:checked').value,
        stage: form.elements.stage.value,
        availability: form.elements.availability.value,
        interests: normalizeList(form.elements.interests.value),
        personality: normalizeList(form.elements.personality.value),
        skills: selectedSkills.length ? selectedSkills : starterProfile.skills,
        lookingFor: ["complementary founder", "high ownership", "honest communication"],
        bio: form.elements.bio.value.trim()
      };
      saveProfile(profile);
      var status = document.querySelector("[data-form-status]");
      if (status) status.textContent = "Profile saved locally. Your matches now re-rank using this profile.";
      window.setTimeout(function () {
        window.location.href = "matches.html";
      }, 650);
    });
  }

  function renderProfileSummary(profile) {
    var el = document.querySelector("[data-profile-summary]");
    if (!el) return;
    el.innerHTML =
      '<span class="eyebrow">Your profile</span>' +
      '<div class="profile-mini">' +
      '<div class="avatar avatar-lg">' + profile.avatar + '</div>' +
      '<div><h3>' + profile.name + '</h3><p>' + profile.title + '</p></div>' +
      '</div>' +
      '<div class="summary-stack">' +
      '<div><span class="eyebrow">Role</span><p>' + titleCase(profile.role) + ' • ' + titleCase(profile.stage) + '</p></div>' +
      '<div><span class="eyebrow">Focus</span><p>' + profile.interests.join(', ') + '</p></div>' +
      '<div><span class="eyebrow">Working style</span><p>' + profile.personality.join(', ') + '</p></div>' +
      '</div>';
  }

  function renderMatchDetail(match) {
    var panel = document.querySelector("[data-match-detail]");
    if (!panel || !match) return;
    panel.innerHTML =
      '<span class="eyebrow">Why this match</span>' +
      '<h3>' + match.candidate.name + '</h3>' +
      '<p class="muted">' + match.summary.join(' • ') + '</p>' +
      '<div class="breakdown-grid">' +
      '<div><span>Role balance</span><strong>' + match.breakdown.role + '%</strong></div>' +
      '<div><span>Skill coverage</span><strong>' + match.breakdown.skills + '%</strong></div>' +
      '<div><span>Market overlap</span><strong>' + match.breakdown.market + '%</strong></div>' +
      '<div><span>Operating style</span><strong>' + match.breakdown.personality + '%</strong></div>' +
      '<div><span>Stage fit</span><strong>' + match.breakdown.stage + '%</strong></div>' +
      '<div><span>Availability</span><strong>' + match.breakdown.availability + '%</strong></div>' +
      '</div>';
  }

  function matchCard(match) {
    var c = match.candidate;
    return '' +
      '<article class="glass-card match-card fade-up">' +
        '<div class="match-card-top">' +
          '<div class="profile-mini">' +
            '<div class="avatar avatar-lg">' + c.avatar + '</div>' +
            '<div>' +
              '<h3>' + c.name + '</h3>' +
              '<p>' + c.title + '</p>' +
              '<span class="meta-line">' + c.location + ' • ' + titleCase(c.role) + ' • ' + titleCase(c.availability) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="score-pill">' + match.score + '%</div>' +
        '</div>' +
        '<p class="match-bio">' + c.bio + '</p>' +
        '<div class="tag-row">' + c.interests.map(function (item) { return '<span class="tag">' + item + '</span>'; }).join('') + '</div>' +
        '<div class="summary-list">' + match.summary.map(function (item) { return '<span>' + item + '</span>'; }).join('') + '</div>' +
        '<div class="match-actions">' +
          '<button class="button button-secondary" type="button" data-detail-id="' + c.id + '">Why this match</button>' +
          '<a class="button" href="chat.html?id=' + c.id + '">Open chat</a>' +
        '</div>' +
      '</article>';
  }

  function bindMatchesPage() {
    var list = document.querySelector("[data-matches-list]");
    if (!list) return;

    var profile = getActiveProfile();
    renderProfileSummary(profile);

    var sortSelect = document.querySelector("[data-sort-select]");
    var roleFilter = document.querySelector("[data-role-filter]");
    var marketFilter = document.querySelector("[data-market-filter]");

    var matches = demoProfiles.map(function (candidate) {
      return computeMatch(profile, candidate);
    });

    function getSortValue(match) {
      var mode = sortSelect ? sortSelect.value : "best";
      if (mode === "market") return match.breakdown.market;
      if (mode === "speed") return match.breakdown.personality + match.breakdown.stage;
      if (mode === "availability") return match.breakdown.availability + match.breakdown.timezone;
      return match.score;
    }

    function render() {
      var filtered = matches.filter(function (match) {
        if (roleFilter && roleFilter.value !== "all" && match.candidate.role !== roleFilter.value) return false;
        if (marketFilter && marketFilter.checked && !match.sharedMarkets.length) return false;
        return true;
      }).sort(function (a, b) {
        return getSortValue(b) - getSortValue(a);
      });

      list.innerHTML = filtered.map(matchCard).join("");
      renderMatchDetail(filtered[0] || matches[0]);

      Array.prototype.slice.call(document.querySelectorAll("[data-detail-id]")).forEach(function (button) {
        button.addEventListener("click", function () {
          var id = button.getAttribute("data-detail-id");
          var match = filtered.find(function (item) { return item.candidate.id === id; });
          renderMatchDetail(match);
        });
      });
    }

    [sortSelect, roleFilter, marketFilter].forEach(function (control) {
      if (control) control.addEventListener("change", render);
    });

    render();
  }

  function getCandidateById(id) {
    return demoProfiles.find(function (profile) {
      return profile.id === id;
    });
  }

  function starterThread(candidate) {
    return [
      { author: "them", text: candidate.prompts.intro },
      { author: "them", text: "I think the interesting question is whether our strengths connect into one believable wedge, not just a cool concept." }
    ];
  }

  function buildMockReply(candidate, message) {
    var lower = message.toLowerCase();
    if (lower.indexOf("market") !== -1 || lower.indexOf("customer") !== -1) {
      return candidate.prompts.focus + " I would probably start with 8-10 customer calls before expanding scope.";
    }
    if (lower.indexOf("speed") !== -1 || lower.indexOf("ship") !== -1 || lower.indexOf("mvp") !== -1) {
      return candidate.prompts.speed + " If we work together, I would want a very explicit 2-week plan and fast feedback loops.";
    }
    if (lower.indexOf("fund") !== -1 || lower.indexOf("raise") !== -1 || lower.indexOf("investor") !== -1) {
      return "I am not allergic to fundraising, but I prefer earning the story through traction first. If the signal is there, I know how to shape the narrative.";
    }
    if (lower.indexOf("cofounder") !== -1 || lower.indexOf("work") !== -1 || lower.indexOf("style") !== -1) {
      return "I care a lot about reliability, direct communication, and clear ownership. If something is yours, I want to feel that it is truly yours.";
    }
    return "That resonates. My edge is in " + candidate.skills.slice(0, 2).join(" and ") + ", and I usually get excited when a founder pairing can combine speed with a real customer truth.";
  }

  function bindChatPage() {
    var shell = document.querySelector("[data-chat-shell]");
    if (!shell) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || demoProfiles[0].id;
    var candidate = getCandidateById(id) || demoProfiles[0];
    var store = getChatStore();
    var thread = store[candidate.id] || starterThread(candidate);

    var title = document.querySelector("[data-chat-title]");
    var subtitle = document.querySelector("[data-chat-subtitle]");
    var avatar = document.querySelector("[data-chat-avatar]");
    var transcript = document.querySelector("[data-chat-messages]");
    var form = document.querySelector("[data-chat-form]");
    var typing = document.querySelector("[data-typing-indicator]");
    var typingLabel = document.querySelector("[data-typing-label]");

    title.textContent = candidate.name;
    subtitle.textContent = candidate.title + " • " + candidate.location;
    if (avatar) avatar.textContent = candidate.avatar;
    if (typingLabel) typingLabel.textContent = candidate.name + " is typing…";

    function renderThread() {
      transcript.innerHTML = "";
      thread.forEach(function (message, index) {
        var row = document.createElement("div");
        row.className = "chat-bubble " + (message.author === "me" ? "mine" : "theirs");
        row.style.animationDelay = index * 40 + "ms";
        row.textContent = message.text;
        transcript.appendChild(row);
      });
      transcript.scrollTop = transcript.scrollHeight;
    }

    renderThread();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.elements.message;
      var text = input.value.trim();
      if (!text) return;

      thread.push({ author: "me", text: text });
      store[candidate.id] = thread;
      saveChatStore(store);
      renderThread();
      input.value = "";

      if (typing) typing.classList.remove("hidden");
      var delay = 900 + Math.min(900, text.length * 14);

      window.setTimeout(function () {
        if (typing) typing.classList.add("hidden");
        thread.push({ author: "them", text: buildMockReply(candidate, text) });
        store[candidate.id] = thread;
        saveChatStore(store);
        renderThread();
      }, delay);
    });
  }

  function bindHomeStats() {
    var count = document.querySelector("[data-profile-count]");
    if (!count) return;
    var target = 1842;
    var current = 0;
    var interval = window.setInterval(function () {
      current += 57;
      if (current >= target) {
        current = target;
        window.clearInterval(interval);
      }
      count.textContent = current.toLocaleString();
    }, 24);
  }

  function bindPageTransitions() {
    Array.prototype.slice.call(document.querySelectorAll("a[href$='.html'], a[href*='.html?']")).forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href");
        if (!href || link.target === "_blank" || event.metaKey || event.ctrlKey) return;
        event.preventDefault();
        document.body.classList.add("is-leaving");
        window.setTimeout(function () {
          window.location.href = href;
        }, 180);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindPageTransitions();
    bindProfileForm();
    bindMatchesPage();
    bindChatPage();
    bindHomeStats();
  });
})();
