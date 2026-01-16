// Simple unit test for SettingsContext logic (Node-based)
// We will mock localStorage and React behavior slightly to test the pure logic

const createMockStorage = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
};

const runTest = () => {
  // Mock State
  let apiKeys = [];
  let currentKeyIndex = 0;

  // Actions
  const updateApiKeys = (keysInput) => {
    apiKeys = keysInput.split(/[\n,]+/).map(k => k.trim()).filter(k => k.length > 0);
    currentKeyIndex = 0;
  };

  const getNextKey = () => {
    if (apiKeys.length === 0) return null;
    return apiKeys[currentKeyIndex];
  };

  const rotateKey = () => {
    if (apiKeys.length <= 1) return false;
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return true;
  };

  console.log("Test 1: Adding keys");
  updateApiKeys("key1\nkey2\nkey3");
  if (apiKeys.length === 3 && getNextKey() === "key1") console.log("PASS"); else console.log("FAIL", apiKeys);

  console.log("Test 2: Rotation");
  rotateKey();
  if (getNextKey() === "key2") console.log("PASS"); else console.log("FAIL", getNextKey());

  console.log("Test 3: Rotation Wrap-around");
  rotateKey(); // key3
  rotateKey(); // back to key1
  if (getNextKey() === "key1") console.log("PASS"); else console.log("FAIL", getNextKey());

  console.log("Test 4: Single Key Rotation (Should Fail)");
  updateApiKeys("onlyOne");
  const result = rotateKey();
  if (result === false && getNextKey() === "onlyOne") console.log("PASS"); else console.log("FAIL");
};

runTest();
