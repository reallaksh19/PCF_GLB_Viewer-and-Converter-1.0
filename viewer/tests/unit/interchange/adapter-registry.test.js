import { pickImportAdapter } from '../../../interchange/source/adapter-registry.js';
import { CaesarXmlImportAdapter } from '../../../interchange/source/xml/CaesarXmlImportAdapter.js';
import { NeutralXmlImportAdapter } from '../../../interchange/source/xml/NeutralXmlImportAdapter.js';

function runTests() {
  let passed = true;

  const mockXmlText = '<PIPINGMODEL><PIPINGELEMENT></PIPINGELEMENT></PIPINGMODEL>';
  const matchXml = pickImportAdapter({ name: 'test.xml', text: mockXmlText });
  if (matchXml.Adapter !== CaesarXmlImportAdapter) {
    console.error('Test 1 Failed: Expected CaesarXmlImportAdapter');
    passed = false;
  }

  const neutralXmlText = '<Model><Components></Components></Model>';
  const matchNeutral = pickImportAdapter({ name: 'test.xml', text: neutralXmlText });
  if (matchNeutral.Adapter !== NeutralXmlImportAdapter) {
    console.error('Test 2 Failed: Expected NeutralXmlImportAdapter');
    passed = false;
  }

  if (passed) {
    console.log('\u2705 Adapter registry tests passed.');
  } else {
    process.exit(1);
  }
}

runTests();
