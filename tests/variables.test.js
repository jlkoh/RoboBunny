/**
 * Variable System Test
 * Verifies that variable operations work and are isolated per bunny.
 */

(function runVariableTests() {
    console.log('🧪 Starting Variable System Tests...\n');

    const GameEngine = window.GameEngine;
    if (!GameEngine) {
        console.error('❌ GameEngine not found!');
        return;
    }

    const ge = new GameEngine();
    ge.reset();

    // Simulate initialization for 2 bunnies
    ge.bunnyCount = 2;
    ge.bunnyActive = [true, true]; // Activate both bunnies manually for testing
    ge.variables = [{}, {}];

    // Helper to log results
    let passed = 0;
    let failed = 0;
    function expect(desc, actual, expected) {
        if (actual === expected) {
            console.log(`✅ ${desc}: ${actual}`);
            passed++;
        } else {
            console.error(`❌ ${desc}: expected ${expected}, got ${actual}`);
            failed++;
        }
    }

    async function runTests() {
        // Test 1: Set Variable
        console.log('\nTest 1: Setting variables');
        // Bunny 0 sets 'score' to 100
        await ge.executeNodeForBunny({
            type: 'SetVar',
            name: 'score',
            value: { type: 'Number', value: 100 }
        }, 0);

        // Bunny 1 sets 'score' to 50
        await ge.executeNodeForBunny({
            type: 'SetVar',
            name: 'score',
            value: { type: 'Number', value: 50 }
        }, 1);

        expect('Bunny 0 score', ge.variables[0]['score'], 100);
        expect('Bunny 1 score', ge.variables[1]['score'], 50);

        // Test 2: Change Variable
        console.log('\nTest 2: Changing variables');
        // Bunny 0 increases 'score' by 10
        await ge.executeNodeForBunny({
            type: 'ChangeVar',
            name: 'score',
            delta: { type: 'Number', value: 10 }
        }, 0);

        expect('Bunny 0 score after increase', ge.variables[0]['score'], 110);
        expect('Bunny 1 score should be unchanged', ge.variables[1]['score'], 50);

        // Test 3: Get Variable (in expression)
        console.log('\nTest 3: Getting variables in expression');
        // Evaluate 'score + 5' for Bunny 0
        const result0 = ge.evaluateForBunny({
            type: 'Binary',
            op: 'ADD',
            left: { type: 'GetVar', name: 'score' },
            right: { type: 'Number', value: 5 }
        }, 0);

        expect('Bunny 0 (score + 5)', result0, 115);

        // Evaluate 'score' for Bunny 1
        const result1 = ge.evaluateForBunny({
            type: 'GetVar',
            name: 'score'
        }, 1);
        expect('Bunny 1 score get', result1, 50);

        console.log('\n' + '='.repeat(40));
        console.log(`📊 Result: ${passed} passed, ${failed} failed`);
    }

    runTests();
})();
