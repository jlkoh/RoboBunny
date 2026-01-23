/**
 * Game Engine Unit Tests
 * 
 * Run these tests by:
 * 1. Opening the game in browser
 * 2. Opening Developer Tools (F12)
 * 3. Pasting the contents of this file into the Console
 * 4. Or include this script in a test HTML page
 */

(function runTests() {
    console.log('🧪 Starting GameEngine Tests...\n');

    // Get GameEngine instance
    const GameEngine = window.GameEngine;
    if (!GameEngine) {
        console.error('❌ GameEngine not found! Make sure game-engine.js is loaded.');
        return;
    }

    // Create a test instance
    const ge = new GameEngine();

    // Setup mock bunnies for testing
    ge.bunnies = [
        { x: 5, y: 10, direction: 'up' },
        { x: 15, y: 3, direction: 'down' }
    ];
    ge.bunnyCount = 2;
    ge.bunnyActive = [true, true];

    let passed = 0;
    let failed = 0;

    function test(name, node, bunnyIdx, expected) {
        const result = ge.evaluateForBunny(node, bunnyIdx);
        const success = result === expected;

        if (success) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.log(`❌ ${name}`);
            console.log(`   Expected: ${expected}, Got: ${result}`);
            failed++;
        }
    }

    // ========== Basic Get Tests ==========
    console.log('\n📍 Basic Get Tests:');

    test('bunny_x for bunny 0',
        { type: 'Get', name: 'bunny_x' },
        0, 5);

    test('bunny_x for bunny 1',
        { type: 'Get', name: 'bunny_x' },
        1, 15);

    test('bunny_y for bunny 0',
        { type: 'Get', name: 'bunny_y' },
        0, 10);

    test('bunny_y for bunny 1',
        { type: 'Get', name: 'bunny_y' },
        1, 3);

    // ========== Nested Binary Expression Tests ==========
    console.log('\n🔢 Nested Binary Expression Tests:');

    test('bunny_x + 1 for bunny 0',
        { type: 'Binary', op: 'ADD', left: { type: 'Get', name: 'bunny_x' }, right: 1 },
        0, 6);

    test('bunny_x + 1 for bunny 1',
        { type: 'Binary', op: 'ADD', left: { type: 'Get', name: 'bunny_x' }, right: 1 },
        1, 16);

    test('bunny_y * 2 for bunny 0',
        { type: 'Binary', op: 'MULTIPLY', left: { type: 'Get', name: 'bunny_y' }, right: 2 },
        0, 20);

    test('bunny_x % 10 for bunny 1',
        { type: 'Binary', op: 'MODULO', left: { type: 'Get', name: 'bunny_x' }, right: 10 },
        1, 5);

    // ========== Nested Comparison Tests ==========
    console.log('\n⚖️ Nested Comparison Tests:');

    test('bunny_x > 10 for bunny 0 (should be false)',
        { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_x' }, right: 10 },
        0, false);

    test('bunny_x > 10 for bunny 1 (should be true)',
        { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_x' }, right: 10 },
        1, true);

    test('bunny_y == 10 for bunny 0 (should be true)',
        { type: 'Compare', op: 'EQ', left: { type: 'Get', name: 'bunny_y' }, right: 10 },
        0, true);

    test('bunny_y < 5 for bunny 1 (should be true)',
        { type: 'Compare', op: 'LT', left: { type: 'Get', name: 'bunny_y' }, right: 5 },
        1, true);

    // ========== Deeply Nested Tests ==========
    console.log('\n🔄 Deeply Nested Expression Tests:');

    // (bunny_x + bunny_y) for bunny 0 = 5 + 10 = 15
    test('(bunny_x + bunny_y) for bunny 0',
        {
            type: 'Binary',
            op: 'ADD',
            left: { type: 'Get', name: 'bunny_x' },
            right: { type: 'Get', name: 'bunny_y' }
        },
        0, 15);

    // (bunny_x + bunny_y) for bunny 1 = 15 + 3 = 18
    test('(bunny_x + bunny_y) for bunny 1',
        {
            type: 'Binary',
            op: 'ADD',
            left: { type: 'Get', name: 'bunny_x' },
            right: { type: 'Get', name: 'bunny_y' }
        },
        1, 18);

    // (bunny_x * 2) + bunny_y for bunny 0 = (5 * 2) + 10 = 20
    test('(bunny_x * 2) + bunny_y for bunny 0',
        {
            type: 'Binary',
            op: 'ADD',
            left: {
                type: 'Binary',
                op: 'MULTIPLY',
                left: { type: 'Get', name: 'bunny_x' },
                right: 2
            },
            right: { type: 'Get', name: 'bunny_y' }
        },
        0, 20);

    // ========== Logic Expression Tests ==========
    console.log('\n🧠 Logic Expression Tests:');

    // bunny_x > 3 AND bunny_y > 5 for bunny 0 (true AND true = true)
    test('bunny_x > 3 AND bunny_y > 5 for bunny 0',
        {
            type: 'Logic',
            op: 'AND',
            left: { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_x' }, right: 3 },
            right: { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_y' }, right: 5 }
        },
        0, true);

    // bunny_x > 3 AND bunny_y > 5 for bunny 1 (true AND false = false)
    test('bunny_x > 3 AND bunny_y > 5 for bunny 1',
        {
            type: 'Logic',
            op: 'AND',
            left: { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_x' }, right: 3 },
            right: { type: 'Compare', op: 'GT', left: { type: 'Get', name: 'bunny_y' }, right: 5 }
        },
        1, false);

    // ========== Summary ==========
    console.log('\n' + '='.repeat(40));
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️ Some tests failed. Please review.');
    }
    console.log('='.repeat(40));

    return { passed, failed };
})();
