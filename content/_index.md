---
# Leave the homepage title empty to use the site title
title:
date: 2023-02-21
type: landing

sections:
  - block: about.avatar
    id: about
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      # Override your bio text from `authors/admin/_index.md`?
      text: |-
        👋 Hi, there! I'm <strong>Cris</strong>! Network Engineer and Python Enthusiast.<br>
        <span style="font-size: 1.2rem; background: linear-gradient(to right, #FFB76B 0%, #FFA73D 30%, #FF7C00 60%, #FF7F04 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
        I build things with Python and give insights into networks for fun.
        </span>
  - block: features
    content:
      title: Skills
      items:
        - name: Python
          icon: python
          description: Automation, Monitoring, CI/CD
          icon_pack: fab
        - name: Network Engineering
          icon: wifi
          description: Wireless, On-Prem & Cloud Datacenter, SDN
          icon_pack: fas
        - name: Leader
          description: Program Management, Sales, Customer Success
          icon: diagram-project
          icon_pack: fas
  - block: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://wowchemy.com/docs/customization/#date-format
      date_format: Jan 2006
      items:
        - title: Solutions Architect 
          company: IP Fabric
          company_url: ''
          company_logo: 
          location: Remote Charlotte, NC
          date_start: '2022-08-01'
          date_end: ''
          description: "
          * Conducting over 75% of product demos in North America.

          * Collaborating with Account Executives for customer satisfaction and success across the sales cycle.

          * Troubleshot a wide range of network infrastructure issues. (BGP, OSPF, STP, Config Driff)
          
          * Ensured customer requirements were understood by multiple teams.
"
        - title: Network Services SME
          company: Axonius
          company_url: ''
          company_logo: 
          location: Remote Charlotte, NC
          date_start: '2022-01-01'
          date_end: '2022-07-01'
          description: "
          * Led discussions on utilizing network data for asset management.

          * Guided customers in using the Axonius API Client.
      
          * Identified product gaps and collaborated on new features.
        
          * Maintained and revamped the Splunk Addon for Axonius.          
"
        - title: Network Automation Engineer
          company: Flexential
          company_url: ''
          company_logo:
          location: Remote Charlotte, NC
          date_start: '2021-07-01'
          date_end: '2021-12-31'
          description: "
          * Implemented CI/CD in GitLab for faster testing of Infrastructure-as-Code.
          
          * Deployed Ansible in a high-availability environment.
          
          * Created a Cisco Webex Bot for network information dissemination.
          
          * Promoted Agile methodology for project management.
          "
        - title: Systems Engineer II
          company: Charter Communications
          company_url: ''
          company_logo:
          location: Denver, CO
          date_start: '2020-03-01'
          date_end: '2021-06-30'
          description: "
          * Oversaw the deployment of Cisco NSO, adding over 1,000 network devices.

          * Administered a Kubernetes environment and deployed database services.
          
          * Redesigned development workflow with Git.

          * Developed a web application providing information about Wireless Access Points.
"
        - title: Network Analyst II
          company: BAE Systems INC
          company_url: ''
          company_logo:
          location: Remote Charlotte, NC
          date_start: '2019-04-01'
          date_end: '2020-03-31'
          description: "
          * Led resolution tickets and maintained exceptional customer service.
          
          * Administered over 10,000 network devices.
          
          * Organized the resolution of significant service-impacting tickets.
                    
          * Converted branch sites to Cisco's software-defined networking.
          
          * Upgraded and maintained system servers for network tools.

          * Managed all DNS entries and automated processes with Infoblox API.

          * Ordered and supervised the installation of new internet circuits.          
"
        - title: Information Technology Specialist 
          company: US ARMY
          company_url: ''
          company_logo:
          location: Fort Bragg, NC & Stuttgart, DE
          date_start: '2013-04-01'
          date_end: '2019-03-31'
          description: '* Managed $500k worth of Communications Equipment.
          
                        * Trained Special Forces Communication Sergeants.
                        
                        * Operated radios in various frequency ranges.
                        
                        * Administered satellite communication systems.
                        
                        * Led radio operations for multiple country training events.
                        
                        * Led a team of communicators, handling user access and device maintenance.
                        
                        * Organized training events for help desk staff.
                    
                        * Supported US Military operations in Africa, ensuring communication standards.'
      design:
        columns: '2'

  - block: collection
    id: posts
    content:
      title: Recent Posts
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - post
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: compact
      columns: '2'
  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
      # Contact (add or remove contact options as necessary)
      email: cristian.cordero@protonmail.com
      appointment_url: 'https://calendly.com/cordero-cristian'
      contact_links:
        - icon: linkedin
          icon_pack: fab
          name: DM Me
          link: 'https://www.linkedin.com/in/cristian-cordero/'
      # Automatically link email and phone or display as text?
      autolink: true
      # Email form provider
      form:
        provider: netlify
        formspree:
          id:
        netlify:
          # Enable CAPTCHA challenge to reduce spam?
          captcha: false
    design:
      columns: '2'
---
