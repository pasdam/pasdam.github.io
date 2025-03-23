---
date: 2025-03-19
summary:
tags:
  - Automation
  - AWS
  - CI-CD
  - Diagramming
  - Documentation
  - GitHub
  - Tutorial
title: Automatically generate diagrams from resources deployed in AWS
---

Navigating through all the services in the AWS console is cumbersome, and
generating diagrams manually and keep them updated is a tedious job.
[infra-inspector](https://infra-inspector.github.io/) automates these processes,
so you can use it in CI/CD environments to automatically or periodically
generate these useful info.

<!--more-->

## Prerequisites

* [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):
  this is required to create the inventory file, as `infra-inspector` will need
  to call AWS APIs; note that only these
  [read permissions](https://infra-inspector.github.io/reference/configuration/aws-permissions/)
  are required.

## Usage

### Generate the inventory

First thing you need to create a configuration to tell the CLI tool which
resources in which region to catalog. Create a file called
`inventory-config.yml` with the following content:

```yaml
awsAccounts:
  - regions:
      - regionName: us-east-1
        services:
          rdsEnabled: true
          elbEnabled: true
          mskEnabled: true
          elasticacheEnabled: true
          openSearchEnabled: true
          transitGatewayEnabled: true
```

For each account you can specify one or more regions, and for each of those you
can enable the services to enable. Refer to the
[official documentation](https://infra-inspector.github.io/reference/configuration/inventory/)
for more info.

Now you can use the config above to generate the inventory:

```bash
docker run --rm \
  -v ~/.aws/credentials:/root/.aws/credentials:ro \
  -v `pwd`/inventory-config.yml:/opt/infra-inspector/inventory-config.yml:ro \
  -v `pwd`/output:/output \
  ghcr.io/infra-inspector/infra-inspector:latest \
  inventory -c /opt/infra-inspector/inventory-config.yml -o /output/inventory.yml
```

This command assumes an
[inventory configuration file](../reference/configuration/inventory.md) named
`inventory-config.yml` and a directory `output` are in the current folder.

It also assume that the
[AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
specified in the config exists in `~/.aws/credentials`. The profile should have
the [permissions](../reference/configuration/aws-permissions.md) to read all the
[supported resources](../reference/supported_resources.md), no write permissions
are needed.

This command will produce something like this:

```yaml
accounts:
  "000000000000":
    id: "000000000000"
    name: ""
    regions:
      us-east-1:
        azs:
          us-east-1a: true
          us-east-1b: true
          us-east-1c: true
          us-east-1d: true
          us-east-1e: true
          us-east-1f: true
        internetGateways: []
        name: us-east-1
        transitGateways: {}
        vpcs:
          vpc-0000000000000000:
            id: vpc-0000000000000000
            name: ""
            cidr: 172.31.0.0/16
            dbClusters: {}
            elasticacheClusters: {}
            elbs: {}
            isDefault: true
            mskClusters: {}
            openSearchClusters: {}
            subnets:
              subnet-00000000000000000:
                id: subnet-00000000000000000
                name: ""
                cidr: 172.31.48.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1d
                natGateways: []
              subnet-00000000000000001:
                id: subnet-00000000000000001
                name: ""
                cidr: 172.31.32.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1c
                natGateways: []
              subnet-00000000000000002:
                id: subnet-00000000000000002
                name: ""
                cidr: 172.31.0.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1a
                natGateways: []
              subnet-00000000000000003:
                id: subnet-00000000000000003
                name: ""
                cidr: 172.31.16.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1b
                natGateways: []
              subnet-00000000000000004:
                id: subnet-00000000000000004
                name: ""
                cidr: 172.31.80.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1f
                natGateways: []
              subnet-00000000000000005:
                id: subnet-00000000000000005
                name: ""
                cidr: 172.31.64.0/20
                autoAssignPublicIp: true
                instances: {}
                az: us-east-1e
                natGateways: []
            tgwAttachments: {}
```

The content might be different based on the resources you have deployed in your
account(s).

### Generate the diagram

From the inventory we generated above we can then create the diagram with:

```bash
docker run --rm \
  -v `pwd`/output/inventory.yml:/opt/infra-inspector/inventory.yml:ro \
  -v `pwd`/output:/output \
  ghcr.io/infra-inspector/infra-inspector:latest \
  diagram -f /opt/infra-inspector/inventory.yml -o /output/diagram.drawio
```

If you need to override some details about the infrastructure (ie. to clarify
some resource names), you can either edit the inventory YAML file before running
the last command, or create a separate inventory containing only the
[overriding values](https://infra-inspector.github.io/guides/properties_override/).

The output can then be opened in [Draw.io](https://www.drawio.com/), which can
be used from the CLI as well, in case you need to export the diagram as image.

With the inventory above you should get this diagram:

<!-- draw.io diagram -->
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile&gt;&lt;diagram id=\&quot;aws\&quot; name=\&quot;AWS\&quot;&gt;&lt;mxGraphModel dx=\&quot;1216\&quot; dy=\&quot;1024\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; background=\&quot;#2A2A2A\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;&lt;root&gt;&lt;mxCell id=\&quot;root\&quot;/&gt;&lt;mxCell id=\&quot;regions-wrapper\&quot; value=\&quot;Regions\&quot; parent=\&quot;root\&quot;&gt;&lt;mxGeometry x=\&quot;40\&quot; y=\&quot;20\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1\&quot; value=\&quot;us-east-1\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region;strokeColor=#147EBA;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#147EBA;dashed=1;\&quot; parent=\&quot;regions-wrapper\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry width=\&quot;1980\&quot; height=\&quot;300\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1a\&quot; value=\&quot;us-east-1a\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;40\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1b\&quot; value=\&quot;us-east-1b\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;360\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1c\&quot; value=\&quot;us-east-1c\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;680\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1d\&quot; value=\&quot;us-east-1d\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1000\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1e\&quot; value=\&quot;us-east-1e\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1320\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;us-east-1f\&quot; value=\&quot;us-east-1f\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#E8E8E8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#E8E8E8;dashed=1;\&quot; parent=\&quot;us-east-1\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1640\&quot; y=\&quot;40\&quot; width=\&quot;300\&quot; height=\&quot;240\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;accounts-wrapper\&quot; value=\&quot;Accounts\&quot; parent=\&quot;root\&quot;&gt;&lt;mxGeometry x=\&quot;20\&quot; y=\&quot;100\&quot; width=\&quot;2040\&quot; height=\&quot;200\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;000000000000\&quot; value=\&quot;000000000000\&quot; style=\&quot;sketch=0;outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud;strokeColor=#AAB7B8;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#AAB7B8;dashed=0;\&quot; parent=\&quot;accounts-wrapper\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry width=\&quot;2020\&quot; height=\&quot;180\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;vpc-0000000000000000\&quot; value=\&quot;vpc-0000000000000000 - 172.31.0.0/16\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc;strokeColor=#248814;fillColor=none;verticalAlign=top;align=left;spacingLeft=30;fontColor=#AAB7B8;dashed=0;\&quot; parent=\&quot;000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;40\&quot; y=\&quot;40\&quot; width=\&quot;1940\&quot; height=\&quot;120\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000002\&quot; value=\&quot;subnet-00000000000000002&amp;lt;br&amp;gt;172.31.0.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;40\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000003\&quot; value=\&quot;subnet-00000000000000003&amp;lt;br&amp;gt;172.31.16.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;360\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000001\&quot; value=\&quot;subnet-00000000000000001&amp;lt;br&amp;gt;172.31.32.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;680\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000000\&quot; value=\&quot;subnet-00000000000000000&amp;lt;br&amp;gt;172.31.48.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1000\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000005\&quot; value=\&quot;subnet-00000000000000005&amp;lt;br&amp;gt;172.31.64.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1320\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;subnet-00000000000000004\&quot; value=\&quot;subnet-00000000000000004&amp;lt;br&amp;gt;172.31.80.0/20\&quot; style=\&quot;points=[[0,0],[0.25,0],[0.5,0],[0.75,0],[1,0],[1,0.25],[1,0.5],[1,0.75],[1,1],[0.75,1],[0.5,1],[0.25,1],[0,1],[0,0.75],[0,0.5],[0,0.25]];outlineConnect=0;gradientColor=none;html=1;fontSize=12;fontStyle=0;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group;grStroke=0;verticalAlign=top;align=left;spacingLeft=30;dashed=0;strokeColor=#248814;fillColor=#E9F3E6;fontColor=#248814;\&quot; parent=\&quot;vpc-0000000000000000\&quot; vertex=\&quot;1\&quot;&gt;&lt;mxGeometry x=\&quot;1640\&quot; y=\&quot;40\&quot; width=\&quot;260\&quot; height=\&quot;60\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=\&quot;000000000000-gw-wrapper\&quot; value=\&quot;\&quot; parent=\&quot;000000000000\&quot;&gt;&lt;mxGeometry x=\&quot;1830\&quot; width=\&quot;220\&quot; height=\&quot;30\&quot; as=\&quot;geometry\&quot;/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

### Use in CI pipelines

The above commands can be used in a CI/CD environment as well to automate the
process, like for instance update the inventory and the diagram every time the
infrastructure is updated, or at specified interval, like once a day.

For instance to automatically generate the inventory and the diagram after an
update to the infrastructure is deployed:

```yaml
name: Infrastructure deployment

on:
  push:
    branch:
      - main

jobs:
  infra-deployment:
    # ...
    # Job to deploy the infrastructure updates, using Terraform, Pulumi or
    # similar
    # ...

  infra-inspector:
    name: Generate inventory
    runs-on: ubuntu-latest
    needs:
      - infra-deployment
    container: ghcr.io/infra-inspector/infra-inspector:latest
    steps:
      - uses: actions/checkout@v4.2.2
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
      - name: Generate inventory
        run: infra-inspector inventory -c inventory-config.yml -o inventory.yml
      - name: Generate diagram
        run: infra-inspector diagram -f inventory.yml -o diagram.drawio
      - name: Archive code coverage results
        uses: actions/upload-artifact@v4
        with:
          name: diagram
          path: diagram.drawio
```

Here the job `infra-inspector` will run only after `infra-deployment` has been
successfully completed, and it will checkout the repository where the inventory
config is (here we are assuming is in the repo root, and it's called
`inventory-config.yml`), configure the AWS credentials needed to pull the data,
generate the inventory and then the diagram, which is then finally stored
as artifact.

## Conclusion

Automating the generation of infrastructure diagrams with tools like
`infra-inspector` offers significant advantages in terms of time savings,
accuracy, and maintaining up-to-date documentation. By integrating this process
into your CI/CD pipelines, you can ensure that your diagrams always reflect the
current state of your AWS environment. This tutorial provides a practical
introduction to using `infra-inspector`, but there's much more to explore,
including advanced configuration options, support for additional AWS services,
and further customization possibilities.

To delve deeper into the capabilities of `infra-inspector`, explore its full
feature set, and access the most up-to-date information, I encourage you to
visit the official documentation at https://infra-inspector.github.io/. There
you'll find comprehensive documentation, detailed configuration guides, and
potentially more advanced use cases to further enhance your infrastructure
visualization and documentation efforts.
