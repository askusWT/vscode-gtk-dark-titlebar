import { Mock, MockBehavior } from 'typemoq';

import setGtkThemeVariant from '../src/setGtkThemeVariant';

suite('setGtkThemeVariant', () => {

    const processMock = Mock.ofType<Extension.ProcessOutput>(undefined, MockBehavior.Strict);

    setup(() => {
        processMock.reset();
    });

    test('should set theme variant for all VS Code windows', async () => {
        processMock
            .setup((x) => x(['pidof', process.execPath]))
            .returns(() => Promise.resolve('3394 3393 3328 3325 3286 3283'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-root', '_NET_CLIENT_LIST']))
            .returns(() => Promise.resolve('_NET_CLIENT_LIST(WINDOW): window id # 0x260000a, 0x260000b, 0x260000c'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-id', '0x260000a', '_NET_WM_PID']))
            .returns(() => Promise.resolve('_NET_WM_PID(CARDINAL) = 1564'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-id', '0x260000b', '_NET_WM_PID']))
            .returns(() => Promise.resolve('_NET_WM_PID(CARDINAL) = 3394'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-id', '0x260000c', '_NET_WM_PID']))
            .returns(() => Promise.resolve('_NET_WM_PID(CARDINAL) = 3283'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-id', '0x260000b',
                             '-f', '_GTK_THEME_VARIANT', '8u',
                             '-set', '_GTK_THEME_VARIANT', 'dark']))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-dark', '-id', '0x260000c',
                             '-f', '_GTK_THEME_VARIANT', '8u',
                             '-set', '_GTK_THEME_VARIANT', 'dark']))
            .verifiable();

        await setGtkThemeVariant('dark', 'xprop-dark', processMock.object);

        processMock.verifyAll();
    });

    test('should set light theme variant', async () => {
        processMock
            .setup((x) => x(['pidof', process.execPath]))
            .returns(() => Promise.resolve('3394'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-light', '-root', '_NET_CLIENT_LIST']))
            .returns(() => Promise.resolve('_NET_CLIENT_LIST(WINDOW): window id # 0x260000a'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-light', '-id', '0x260000a', '_NET_WM_PID']))
            .returns(() => Promise.resolve('_NET_WM_PID(CARDINAL) = 3394'))
            .verifiable();
        processMock
            .setup((x) => x(['xprop-light', '-id', '0x260000a',
                             '-f', '_GTK_THEME_VARIANT', '8u',
                             '-set', '_GTK_THEME_VARIANT', 'light']))
            .verifiable();

        await setGtkThemeVariant('light', 'xprop-light', processMock.object);

        processMock.verifyAll();
    });

});
