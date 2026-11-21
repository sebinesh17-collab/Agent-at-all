import * as t_0 from './catalog/web-search';
import * as t_1 from './catalog/web-open';
import * as t_2 from './catalog/web-extract';
import * as t_3 from './catalog/files-search';
import * as t_4 from './catalog/files-read';
import * as t_5 from './catalog/files-write';
import * as t_6 from './catalog/files-list';
import * as t_7 from './catalog/files-delete';
import * as t_8 from './catalog/writing-document';
import * as t_9 from './catalog/writing-markdown';
import * as t_10 from './catalog/writing-rewrite';
import * as t_11 from './catalog/writing-grammar';
import * as t_12 from './catalog/writing-summarize';
import * as t_13 from './catalog/code-read';
import * as t_14 from './catalog/code-write';
import * as t_15 from './catalog/code-review';
import * as t_16 from './catalog/code-test';
import * as t_17 from './catalog/terminal-exec';
import * as t_18 from './catalog/terminal-files';
import * as t_19 from './catalog/terminal-install';
import * as t_20 from './catalog/terminal-process';
import * as t_21 from './catalog/terminal-git';
import * as t_22 from './catalog/database-query';
import * as t_23 from './catalog/database-migrate';
import * as t_24 from './catalog/email-send';
import * as t_25 from './catalog/agents-dispatch';
import * as t_26 from './catalog/agents-status';
import * as t_27 from './catalog/runs-status';
import * as t_28 from './catalog/runs-logs';
import * as t_29 from './catalog/reports-write';
import * as t_30 from './catalog/charts-create';
import * as t_31 from './catalog/data-analyze';
import * as t_32 from './catalog/data-transform';
import * as t_33 from './catalog/models-compare';
import * as t_34 from './catalog/secrets-read';
import * as t_35 from './catalog/cloudflare-deploy';
import * as t_36 from './catalog/security-scan';
import * as t_37 from './catalog/design-tokens';
import * as t_38 from './catalog/design-review';
import * as t_39 from './catalog/crm-records';
import * as t_40 from './catalog/calendar-events';
import * as t_41 from './catalog/browser-navigate';
import * as t_42 from './catalog/browser-screenshot';
import * as t_43 from './catalog/browser-click';
import * as t_44 from './catalog/browser-type';
import * as t_45 from './catalog/browser-extract';
import * as t_46 from './catalog/storage-upload';
import * as t_47 from './catalog/storage-download';
import * as t_48 from './catalog/storage-delete';
import * as t_49 from './catalog/storage-search';
import * as t_50 from './catalog/queue-enqueue';
import * as t_51 from './catalog/queue-inspect';
import * as t_52 from './catalog/workflow-start';
import * as t_53 from './catalog/workflow-pause';
import * as t_54 from './catalog/workflow-resume';
import * as t_55 from './catalog/workflow-cancel';
import * as t_56 from './catalog/agent-create';
import * as t_57 from './catalog/agent-update';
import * as t_58 from './catalog/agent-delete';
import * as t_59 from './catalog/provider-list';
import * as t_60 from './catalog/provider-models';
import * as t_61 from './catalog/provider-keys';
import * as t_62 from './catalog/provider-health';
import * as t_63 from './catalog/provider-rotate';
import * as t_64 from './catalog/chat-send';
import * as t_65 from './catalog/chat-history';
import * as t_66 from './catalog/chat-export';
import * as t_67 from './catalog/prompt-test';
import * as t_68 from './catalog/prompt-version';
import * as t_69 from './catalog/prompt-rollback';
import * as t_70 from './catalog/task-create';
import * as t_71 from './catalog/task-assign';
import * as t_72 from './catalog/task-complete';
import * as t_73 from './catalog/task-block';
import * as t_74 from './catalog/task-decompose';
import * as t_75 from './catalog/task-validate';
import * as t_76 from './catalog/memory-store';
import * as t_77 from './catalog/memory-read';
import * as t_78 from './catalog/memory-search';
import * as t_79 from './catalog/memory-delete';
import * as t_80 from './catalog/notification-push';
import * as t_81 from './catalog/notification-email';
import * as t_82 from './catalog/notification-webhook';
import * as t_83 from './catalog/webhook-create';
import * as t_84 from './catalog/webhook-test';
import * as t_85 from './catalog/webhook-logs';
import * as t_86 from './catalog/auth-invite';
import * as t_87 from './catalog/auth-roles';
import * as t_88 from './catalog/auth-audit';
import * as t_89 from './catalog/audit-events';
import * as t_90 from './catalog/billing-usage';
import * as t_91 from './catalog/billing-limits';
import * as t_92 from './catalog/scheduler-create';
import * as t_93 from './catalog/scheduler-list';
import * as t_94 from './catalog/scheduler-delete';
import * as t_95 from './catalog/git-status';
import * as t_96 from './catalog/git-diff';
import * as t_97 from './catalog/git-commit';
import * as t_98 from './catalog/git-branch';
import * as t_99 from './catalog/package-install';
import * as t_100 from './catalog/package-audit';
import * as t_101 from './catalog/package-list';
import * as t_102 from './catalog/linux-pwd';
import * as t_103 from './catalog/linux-ls';
import * as t_104 from './catalog/linux-mkdir';
import * as t_105 from './catalog/linux-cp';
import * as t_106 from './catalog/linux-mv';
import * as t_107 from './catalog/linux-rm';
import * as t_108 from './catalog/linux-cat';
import * as t_109 from './catalog/linux-grep';
import * as t_110 from './catalog/linux-find';
import * as t_111 from './catalog/linux-chmod';
import * as t_112 from './catalog/linux-env';
import * as t_113 from './catalog/linux-python';
import * as t_114 from './catalog/linux-node';
import * as t_115 from './catalog/linux-npm';
import * as t_116 from './catalog/linux-pip';
import * as t_117 from './catalog/linux-apt';
import * as t_118 from './catalog/linux-curl';
import * as t_119 from './catalog/linux-wget';
import * as t_120 from './catalog/linux-tar';
import * as t_121 from './catalog/linux-zip';
import * as t_122 from './catalog/linux-unzip';
import * as t_123 from './catalog/linux-ps';
import * as t_124 from './catalog/linux-top';
import * as t_125 from './catalog/linux-df';
import * as t_126 from './catalog/linux-du';
import * as t_127 from './catalog/linux-tail';
import * as t_128 from './catalog/linux-head';
import * as t_129 from './catalog/linux-sed';
import * as t_130 from './catalog/linux-awk';
import * as t_131 from './catalog/linux-make';
import * as t_132 from './catalog/linux-docker';
import * as t_133 from './catalog/linux-ssh';
import * as t_134 from './catalog/linux-rsync';
import * as t_135 from './catalog/linux-node-version';
import * as t_136 from './catalog/linux-python-version';
import * as t_137 from './catalog/agent-message';
import * as t_138 from './catalog/agent-inbox';

export const toolRegistry = new Map<string, any>([
  [t_0.definition.id, t_0],
  [t_1.definition.id, t_1],
  [t_2.definition.id, t_2],
  [t_3.definition.id, t_3],
  [t_4.definition.id, t_4],
  [t_5.definition.id, t_5],
  [t_6.definition.id, t_6],
  [t_7.definition.id, t_7],
  [t_8.definition.id, t_8],
  [t_9.definition.id, t_9],
  [t_10.definition.id, t_10],
  [t_11.definition.id, t_11],
  [t_12.definition.id, t_12],
  [t_13.definition.id, t_13],
  [t_14.definition.id, t_14],
  [t_15.definition.id, t_15],
  [t_16.definition.id, t_16],
  [t_17.definition.id, t_17],
  [t_18.definition.id, t_18],
  [t_19.definition.id, t_19],
  [t_20.definition.id, t_20],
  [t_21.definition.id, t_21],
  [t_22.definition.id, t_22],
  [t_23.definition.id, t_23],
  [t_24.definition.id, t_24],
  [t_25.definition.id, t_25],
  [t_26.definition.id, t_26],
  [t_27.definition.id, t_27],
  [t_28.definition.id, t_28],
  [t_29.definition.id, t_29],
  [t_30.definition.id, t_30],
  [t_31.definition.id, t_31],
  [t_32.definition.id, t_32],
  [t_33.definition.id, t_33],
  [t_34.definition.id, t_34],
  [t_35.definition.id, t_35],
  [t_36.definition.id, t_36],
  [t_37.definition.id, t_37],
  [t_38.definition.id, t_38],
  [t_39.definition.id, t_39],
  [t_40.definition.id, t_40],
  [t_41.definition.id, t_41],
  [t_42.definition.id, t_42],
  [t_43.definition.id, t_43],
  [t_44.definition.id, t_44],
  [t_45.definition.id, t_45],
  [t_46.definition.id, t_46],
  [t_47.definition.id, t_47],
  [t_48.definition.id, t_48],
  [t_49.definition.id, t_49],
  [t_50.definition.id, t_50],
  [t_51.definition.id, t_51],
  [t_52.definition.id, t_52],
  [t_53.definition.id, t_53],
  [t_54.definition.id, t_54],
  [t_55.definition.id, t_55],
  [t_56.definition.id, t_56],
  [t_57.definition.id, t_57],
  [t_58.definition.id, t_58],
  [t_59.definition.id, t_59],
  [t_60.definition.id, t_60],
  [t_61.definition.id, t_61],
  [t_62.definition.id, t_62],
  [t_63.definition.id, t_63],
  [t_64.definition.id, t_64],
  [t_65.definition.id, t_65],
  [t_66.definition.id, t_66],
  [t_67.definition.id, t_67],
  [t_68.definition.id, t_68],
  [t_69.definition.id, t_69],
  [t_70.definition.id, t_70],
  [t_71.definition.id, t_71],
  [t_72.definition.id, t_72],
  [t_73.definition.id, t_73],
  [t_74.definition.id, t_74],
  [t_75.definition.id, t_75],
  [t_76.definition.id, t_76],
  [t_77.definition.id, t_77],
  [t_78.definition.id, t_78],
  [t_79.definition.id, t_79],
  [t_80.definition.id, t_80],
  [t_81.definition.id, t_81],
  [t_82.definition.id, t_82],
  [t_83.definition.id, t_83],
  [t_84.definition.id, t_84],
  [t_85.definition.id, t_85],
  [t_86.definition.id, t_86],
  [t_87.definition.id, t_87],
  [t_88.definition.id, t_88],
  [t_89.definition.id, t_89],
  [t_90.definition.id, t_90],
  [t_91.definition.id, t_91],
  [t_92.definition.id, t_92],
  [t_93.definition.id, t_93],
  [t_94.definition.id, t_94],
  [t_95.definition.id, t_95],
  [t_96.definition.id, t_96],
  [t_97.definition.id, t_97],
  [t_98.definition.id, t_98],
  [t_99.definition.id, t_99],
  [t_100.definition.id, t_100],
  [t_101.definition.id, t_101],
  [t_102.definition.id, t_102],
  [t_103.definition.id, t_103],
  [t_104.definition.id, t_104],
  [t_105.definition.id, t_105],
  [t_106.definition.id, t_106],
  [t_107.definition.id, t_107],
  [t_108.definition.id, t_108],
  [t_109.definition.id, t_109],
  [t_110.definition.id, t_110],
  [t_111.definition.id, t_111],
  [t_112.definition.id, t_112],
  [t_113.definition.id, t_113],
  [t_114.definition.id, t_114],
  [t_115.definition.id, t_115],
  [t_116.definition.id, t_116],
  [t_117.definition.id, t_117],
  [t_118.definition.id, t_118],
  [t_119.definition.id, t_119],
  [t_120.definition.id, t_120],
  [t_121.definition.id, t_121],
  [t_122.definition.id, t_122],
  [t_123.definition.id, t_123],
  [t_124.definition.id, t_124],
  [t_125.definition.id, t_125],
  [t_126.definition.id, t_126],
  [t_127.definition.id, t_127],
  [t_128.definition.id, t_128],
  [t_129.definition.id, t_129],
  [t_130.definition.id, t_130],
  [t_131.definition.id, t_131],
  [t_132.definition.id, t_132],
  [t_133.definition.id, t_133],
  [t_134.definition.id, t_134],
  [t_135.definition.id, t_135],
  [t_136.definition.id, t_136],
  [t_137.definition.id, t_137],
  [t_138.definition.id, t_138]
]);
export const toolDefinitions = [...toolRegistry.values()].map((tool: any) => tool.definition);
