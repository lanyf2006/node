// Copyright 2014 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-debug-as debug --allow-natives-syntax

// Test debug events when we only listen to uncaught exceptions and
// there is a catch handler for the exception thrown in a Promise.
// We expect no debug event to be triggered.

Debug = debug.Debug;

var p = new Promise(function(resolve, reject) {
  resolve();
});

var q = p.then(
  function() {
    throw new Error("caught throw");
  });

q.catch(
  function(e) {
    assertEquals("caught throw", e.message);
  });

function listener(event, exec_state, event_data, data) {
  try {
    assertTrue(event != Debug.DebugEvent.Exception);
  } catch (e) {
    %AbortJS(e + "\n" + e.stack);
  }
}

Debug.setBreakOnUncaughtException();
Debug.setListener(listener);
