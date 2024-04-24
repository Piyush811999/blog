---
layout: ../layouts/BlogPost.astro
title: Reliability, Scalability, and Maintainability of a Web Applications (DDIA CH1)
slug: ddia-1-reliable-scalable-and-maintainable-applications
description: Notes on chapter 1. of Designing Data-Intensive Applications.
added: Apr 24 2024 15:09
updated: Apr 24 2024 15:26
tags:
  - technical
  - learning
  - software-engineering
  - ddia
  - book-notes
  - medium
---
> Note: These notes are taken while reading chapter 1. of the book Designing Data-Intensive Applications, for more details please refer the book.

# Table of Contents
- [Thinking about Data Systems](#thinking-about-data-systems)
- [Reliability](#reliability)
  - [Hardware Faults](#hardware-faults)
  - [Software Errors](#software-errors)
  - [Human Errors](#human-errors)
- [Scalability](#scalability)
  - [Load parameter](#load-parameter)
  - [Twitter's Example](#twitters-example)
  - [Describing Performance](#describing-performance)
  - [Approaches for Coping with Load](#approaches-for-coping-with-load)
- [Maintainability](#maintainability)
  - [Operability](#operability)
  - [Simplicity](#simplicity)
  - [Evolvability](#evolvability)


Commonly needed functionality of data-intensive applications
* database
* cache
* Search index
* stream processing
* batch processing

## Thinking about Data Systems

In recent years boundaries between these categories have become blurred. Many tools optimise for different use cases such as:
* Redis: datastore that is also used as a message queue
* Kafka: message queue with database-like durability

Applications now have such demanding or wide-ranging requirements that a single tool can no longer meet all its data processing and storage needs. Instead, the **work is broken down into tasks that can be performed efficiently on a single tool, and the different tools are stitched together using application code.**

Factors that influence the design of a data system:
* Reliability
* Scalability 
* Maintainability

<hr>

## Reliability
* The system should continue to work correctly even in the face of adversity (faults).
* **faults**: Things that can go wrong
* fault vs failure: A fault is usually defined as one component of the system deviating from its spec, whereas a failure is when the system as a whole stops providing the required service to the user.
* **fault-tolerant system**: a system that can anticipate faults and prevent them from causing failures.
* Testing a fault-tolerant system: deliberately inducing faults. ([The Netflix Chaos Monkey](https://netflixtechblog.com/the-netflix-simian-army-16e57fbab116))
* We generally prefer tolerating faults over preventing them. But in cases such as data breaches, which can't be undone prevention is better than cure.

### Hardware Faults
* First response: Add redundancy to individual hardware components.
	* Disk: setup disk in RAID configuration
	* Power Supply: have dual supplies, backup power
	* CPU: have hot-swappable cpus.
* When a component dies, the redundant component can take its place.
* In case of machine failure: restore a backup onto a new machine, there's a downtime. **Multi-machine redundancy** is required for applications that require high availability. 
* **Hardware faults are generally random and independent of each other.** i.e. it's unlikely that a large number of hardware components will fail at the same time.

### Software Errors
* They are **systematic errors** that are triggered by an unusual set of circumstances.
* Software makes an assumption about its environment which is no longer true. 
* Ex: Software bug for a bad input, runaway process, cascading failures.
* **There's no quick solution**: carefully thinking about assumptions and interactions in the system; through testing; process isolation; allowing processes to crash and restart; and measuring; monitoring and analysing system behaviour in production can help. 

### Human Errors
Human beings are unreliable.
Way to make the system reliable, despite that fact:
* Make it easy to do the right thing: we'll design abstraction, API's and interfaces. (Although if the interface is too restrictive people will work around them, negating their benefits, so you need to get the balance right)
* Sandbox environment: people can explore and experiment safely, without affecting real users. 
* Allow quick and easy recovery. (Easy rollback, gradual deployment, tools to recompute data)
* Detailed and clear monitoring.

<hr>

## Scalability
Systems ability to cope with increased load

### Load parameter
* **Numbers which can describe load.**
* Depends on the architecture of the system 
* Example: RPS, no. of active users, read/write ratio etc.

### Twitter's Example
Systems Functionality:
* Post Tweet: new message to user's followers (4.6K rps)
* Home Timeline: view tweets posted by people current_user follows (300K rps)

#### Implementation #1 Using a Relational DB
Tables:
* Tweets `[id, sender_id, text, timestamp]`
* Users `[id, user_name]`
* Followers `[follower_id, followee_id]`
Operations:
* Post Tweet: Append tweet to Tweets table.
* Home Timeline.
	* Look up all the people current_user follows.
	* Look up all the tweets from those people
```sql
-- Home Timeline.
SELECT tweets.*, users.* FROM tweets
  JOIN users   ON tweets.sender_id    = users.id
  JOIN follows ON follows.followee_id = users.id
  WHERE follows.follower_id = current_user
```
Most of the work here is done while reading. (During the Home Timeline operation)

#### Implementation #2 Maintain a cache for each user timeline
Operations:
* Post Tweet:
	* Look up all the people who follow the user.
	* Insert the tweet into each person's timeline cache.
* Home Timeline:
	* read the home timeline cache.

Most of the work is done while writing (During the Post tweet operation)

`Writes per second per hometimeline = (avg no. of tweets per second)*(avg no. of followers per user) `
* Avg writes to home timeline cache = 4.6k/sec x 75 (which is avg. no of followers per user)
* Avg writes to home timeline cache = 345k/sec (per user)

<div style="background-color: lightgray; padding: 10px">
<b>Load Parameter</b>: Distribution of followers per user weighted by avg. no. of tweets per user.
</div>

Extreme case: Users with millions of followers
* For a user with 30million followers writes to timeline cache = 30mil X 4.6 ~ 120mil writes (very expensive)
* 
To tackle this we can use a hybrid approach.



#### Hybrid approach
* For most users: Use Implementation #2 
* For people with large number of followers: Use Implementation #1
* Merge the results.

### Describing Performance
How the performance is impacted when the load is increased? (Keeping the system resources unchanged)
Example:
* **Batch Processing system**: it's throughput i.e. number of records we can process per second.
* In an **online system**: it could be response time.
#### Latency vs Response Time
* Latency: duration that a request is waiting to be handled. 
* Response time: what the client sees: time b/w the client sending a request and receiving a response.

#### Percentile
What percentage of your requests have a response time less than x.
* 50th percentile aka p50 aka median.
	* if the median response time is 200ms, it means that half of the request return in less than 200ms.
* To look at how bad our outliers are we look at higher percentiles. the 95th, 99th, and 99.9th percentiles are common (abbreviated p95, p99, and p999).
* Example Amazon:
	* amazon uses p999 as a performance metric.
	* customers with the slowest requests are often those who have the most data on their accounts because they have made many purchases—that is, they’re the most valuable customers
	* 100 ms increase in response time reduces sales by 1%, and others report that a 1-second slowdown reduces a customer satisfaction metric by 16%
	* optimizing the 99.99th percentile (the slowest 1 in 10,000 requests) was deemed too expensive and to not yield enough benefit for Amazon’s purposes.
* Reducing response times at very high percentiles is difficult because they are easily affected by random events outside of your control.
##### Queueing delay
it only takes a small number of slow requests to hold up the processing of the subsequent request
##### Tail latency amplification
if only a small percentage of backend calls are slow, the chance of getting a slow call increases if an end-user request requires multiple backend calls, and so a higher proportion of end-user requests end up being slow


#### SLO (service level objectives) and SLA (service level agreements)
* Contracts that define the expected performance and availability of a service.
* These metrics set expectations for clients of the service and allow customers to demand a refund if the SLA is not met
* Example: An SLA may state that the service is considered to be up if it has a median response time of less than 200 ms and a 99th percentile under 1 s (if the response time is longer, it might as well be down), and the service may be required to be up at least 99.9% of the time.
### Approaches for Coping with Load
* An architecture that is appropriate for one level of load is unlikely to cope with 10 times that load. 
	* You will need to rethink your architecture on every order of magnitude load increase.
* Scaling up vs Scaling out
	* Scaling up (Vertical scaling): moving to a more powerful machine.
	* Scaling out (Horizontal scaling): distributing load across multiple smaller machines. (aka **Shared-nothing architecture.**)
* Elastic system
	* can automatically add computing resources when they detect a load increase.
	* can be useful if the load is highly unpredictable.

### Is scalability always important?
No, for example, In an early-stage startup or an unproven product, it’s usually more important to be able to iterate quickly on product features than it is to scale to some hypothetical future load.

<hr>

## Maintainability
The major cost of software is its ongoing maintenance and improvements.
We will pay particular attention to three designs for system systems:

### Operability
Make it easy for operations teams to keep the system running smoothly.

A good operations team is typically responsible for the following and more.
* Monitoring system health
* Perform complex maintenance tasks
* Tracking down the cause of the problem, anticipating future problems (capacity planning)
* Keeping software up to date

Good operability means making routine tasks easy, allowing the operations team to focus their efforts on high-value activities.

To make routine tasks easier data systems can:
* Provide visibility into runtime behaviour and internal systems. (good monitoring tools)
* Good support for automation and integration with standard tools
* Avoid dependency on individual machines. (so that machines can be taken down for maintenance)
* Providing good documentation.

### Simplicity
Make it easy for new engineers to understand the system, by removing as much complexity as possible from the system.

Abstraction
* One of the best tools we have for removing accidental complexity is abstraction.
* quality improvements in the abstracted component benefit all applications that use it.

### Evolvability
Make it easy for engineers to make changes to the system in the future, adapting it for unanticipated use cases as requirements change. Also known as extensibility, modifiability, or plasticity.

**Agile** working patterns provide a framework for adapting to change.
