import * as assert from 'assert';
import { Mock } from 'typemoq';
import { WorkspaceConfiguration } from 'vscode';

import getActiveThemeVariant from '../src/getActiveThemeVariant';

suite('getActiveThemeVariant', () => {

    const configMock = Mock.ofType<WorkspaceConfiguration>();

    function givenSetting(key: string, value: string) {
        configMock
        .setup((x) => x.get(key))
        .returns(() => value);
    }

    setup(() => {
        configMock.reset();
    });

    test('should return "light" if setting is "light"', () => {
        givenSetting('gtkTitleBar.mode', 'light');

        const activeThemeVariant = getActiveThemeVariant(configMock.object, []);

        assert.strictEqual(activeThemeVariant, 'light');
    });

    test('should return "dark" if setting is "dark"', () => {
        givenSetting('gtkTitleBar.mode', 'dark');

        const activeThemeVariant = getActiveThemeVariant(configMock.object, []);

        assert.strictEqual(activeThemeVariant, 'dark');
    });

    test('should return variant from current theme if setting is "auto"', () => {
        givenSetting('gtkTitleBar.mode', 'auto');
        givenSetting('workbench.colorTheme', 'Monokai');
        const themeInfo: Extension.ThemeInfo[] = [
            { name: 'Monokai', variant: 'dark' },
            { name: 'Tomorrow', variant: 'light' },
        ];

        const activeThemeVariant = getActiveThemeVariant(configMock.object, themeInfo);

        assert.strictEqual(activeThemeVariant, 'dark');
    });

    test('should return "light" if setting is "auto" and current theme is unknown', () => {
        givenSetting('gtkTitleBar.mode', 'auto');
        givenSetting('workbench.colorTheme', 'Tomorrow');
        const themeInfo: Extension.ThemeInfo[] = [
            { name: 'Monokai', variant: 'dark' },
        ];

        const activeThemeVariant = getActiveThemeVariant(configMock.object, themeInfo);

        assert.strictEqual(activeThemeVariant, 'light');
    });

    test('should return "light" if setting is an unsupported value', () => {
        givenSetting('gtkTitleBar.mode', 'something else');

        const activeThemeVariant = getActiveThemeVariant(configMock.object, []);

        assert.strictEqual(activeThemeVariant, 'light');
    });

});
