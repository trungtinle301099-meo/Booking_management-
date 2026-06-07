import { ContentType, Severity } from 'allure-js-commons';
import * as allure from 'allure-js-commons';

export type AllureApiMetadata = {
  epic: string;
  feature: string;
  story: string;
  owner?: string;
  severity?: Severity;
  tags?: string[];
  description?: string;
};

export async function setAllureApiMetadata(metadata: AllureApiMetadata): Promise<void> {
  await allure.epic(metadata.epic);
  await allure.feature(metadata.feature);
  await allure.story(metadata.story);

  if (metadata.owner) {
    await allure.owner(metadata.owner);
  }

  if (metadata.severity) {
    await allure.severity(metadata.severity);
  }

  if (metadata.description) {
    await allure.description(metadata.description);
  }

  if (metadata.tags?.length) {
    for (const tag of metadata.tags) {
      await allure.tag(tag);
    }
  }
}

export async function addAllureParameter(
  name: string,
  value: string | number | boolean,
): Promise<void> {
  await allure.parameter(name, String(value));
}

export async function addJsonAttachment(name: string, data: unknown): Promise<void> {
  await allure.attachment(name, JSON.stringify(data, null, 2), ContentType.JSON);
}

export async function addTextAttachment(name: string, data: string): Promise<void> {
  await allure.attachment(name, data, ContentType.TEXT);
}

export async function allureStep<T>(name: string, body: () => Promise<T>): Promise<T> {
  return allure.step(name, body);
}

export { Severity };
