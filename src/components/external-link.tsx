import { Link, type LinkProps } from 'expo-router';
import * as Linking from 'expo-linking';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

type ExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: LinkProps['href'];
  inApp?: boolean;
};

export async function openExternalLink(
  href: string,
  options?: {
    inApp?: boolean;
  }
) {
  if (options?.inApp === false || Platform.OS === 'web') {
    await Linking.openURL(href);
    return;
  }

  await WebBrowser.openBrowserAsync(href);
}

export function ExternalLink({ href, inApp = true, onPress, ...rest }: ExternalLinkProps) {
  return (
    <Link
      {...rest}
      href={href}
      target="_blank"
      onPress={async (event) => {
        if (inApp && Platform.OS !== 'web') {
          event.preventDefault();
          await WebBrowser.openBrowserAsync(href.toString());
        }

        await onPress?.(event);
      }}
    />
  );
}
