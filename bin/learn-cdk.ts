#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LearnCdkStack } from '../lib/index';

const app = new cdk.App();
new LearnCdkStack(app, 'LearnCdkStack', {});
